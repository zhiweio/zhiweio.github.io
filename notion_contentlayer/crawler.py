import json
import logging
import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from notion2md.exporter.block import StringExporter
from notion_database.database import Database

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DIR = Path(__file__).parent
SITE_DIR = NOTION_DIR.parent
BLOG_DIR = SITE_DIR.joinpath("data", "blog")
OFFSET_FILE = NOTION_DIR / "notion_offset.json"
CONFIG_FILE = NOTION_DIR / "notion.json"


# Read configuration
def load_config():
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text(encoding="utf8"))
    logger.warning("Configuration file not found, using defaults.")
    return {}


# Offset management
def read_offset():
    if OFFSET_FILE.exists():
        with open(OFFSET_FILE, encoding="utf8") as f:
            return json.load(f)
    return {}


def write_offset(offset_data):
    with open(OFFSET_FILE, "w", encoding="utf8") as f:
        json.dump(offset_data, f, ensure_ascii=False, indent=4)


def update_offset(offset_data, page):
    offset_data[page["id"]] = page["last_edited_time"]


# Notion API interaction
class NotionClient:
    def __init__(self, token):
        self.client = Database(integrations_token=token)

    def fetch_pages(self, database_id, offset):
        pages = []
        self.client.retrieve_database(database_id)
        self.client.find_all_page(database_id=database_id)

        for page in self.client.result.get("results", []):
            page_id = page["id"]
            if page_id not in offset or page["last_edited_time"] != offset[page_id]:
                pages.append(page)

        # Handle pagination
        while self.client.result.get("has_more", False):
            self.client.find_all_page(
                database_id=database_id, start_cursor=self.client.result["next_cursor"]
            )
            for page in self.client.result.get("results", []):
                page_id = page["id"]
                if page_id not in offset or page["last_edited_time"] != offset[page_id]:
                    pages.append(page)

        return pages


def parse_page_properties(page):
    properties = page.get("properties", {})
    title = (
        " ".join(
            t.get("plain_text", "") for t in properties.get("Name", {}).get("title", [])
        )
        if "Name" in properties
        else None
    )
    date = properties.get("Post date", {}).get("date", {}).get("start", None)
    last_edited_time = page.get("last_edited_time")
    lastmod = (
        datetime.fromisoformat(last_edited_time[:-1]).strftime("%Y-%m-%d")
        if last_edited_time
        else None
    )
    tags = (
        [tag.get("name") for tag in properties.get("Tags", {}).get("multi_select", [])]
        if "Tags" in properties
        else None
    )
    summary = (
        " ".join(
            t.get("plain_text", "")
            for t in properties.get("Summary", {}).get("rich_text", [])
        )
        if "Summary" in properties
        else None
    )
    cover = page.get("cover")
    images = (
        [cover["external"]["url"]]
        if cover and cover.get("type") == "external"
        else None
    )
    props = {
        "title": title,
        "date": date,
        "lastmod": lastmod,
        "tags": tags,
        "summary": summary,
        "images": images,
        "draft": False,
    }
    return props


def generate_post_metadata_md(post_data):
    lines = ["---"]
    for key, value in post_data.items():
        if value:
            lines.append(f"{key}: {value!r}")
    lines.append("---")
    return "\n".join(lines)


def write_post_to_file(post_data, content_md, blog_dir):
    title = post_data["title"]
    post_file = blog_dir / f"{title}.mdx"
    metadata_md = generate_post_metadata_md(post_data)
    post_file.write_text(metadata_md + "\n\n" + content_md, encoding="utf8")
    logger.info(f"Post written to {post_file}")


if __name__ == "__main__":
    notion_config = load_config()
    notion_offset = read_offset()
    notion_client = NotionClient(token=NOTION_TOKEN)
    blog_dir = BLOG_DIR
    blog_dir.mkdir(parents=True, exist_ok=True)

    all_pages = []
    for database_id in notion_config.get("databases_id", []):
        logger.info(f"Fetching pages from database {database_id}")
        pages = notion_client.fetch_pages(database_id, notion_offset)
        all_pages.extend(pages)

    for page in all_pages:
        page_id = page["id"]
        logger.info(f"Processing page {page_id}")
        props = parse_page_properties(page)
        content_md = StringExporter(block_id=page_id, output_path="/tmp").export()
        write_post_to_file(props, content_md, blog_dir)
        update_offset(notion_offset, page)

    write_offset(notion_offset)
