import json
import logging
import os
from datetime import datetime
from pathlib import Path

from notion2md.exporter.block import StringExporter
from notion_database.database import Database

try:
    from dotenv import load_dotenv

    load_dotenv()
except ModuleNotFoundError:
    pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NOTION_TOKEN = os.getenv("NOTION_TOKEN")


def get_post_properties(page):
    properties = page.get("properties", {})
    title = (
        " ".join(
            t.get("plain_text", "")
            for t in properties.get("Name", {}).get("title", [])
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
    tags = [
        tag.get("name") for tag in properties.get("Tags", {}).get("multi_select", [])
    ] if "Tags" in properties else None
    summary = (
        " ".join(
            t.get("plain_text", "")
            for t in properties.get("Summary", {}).get("rich_text", [])
        )
        if "Summary" in properties
        else None
    )
    cover = page.get("cover")
    images = [cover["external"]["url"]] if cover and cover.get("type") == "external" else None
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


def gen_post_properties_md(props):
    content = ["---"]
    for key, value in props.items():
        if value:
            content.append(f"{key}: {value!r}")
    content.append("---")
    return "\n".join(content)


def get_all_updated_pages(database_id):
    pages = []
    D = Database(integrations_token=NOTION_TOKEN)
    D.retrieve_database(database_id)

    # Finding all pages in a database
    D.find_all_page(database_id=database_id, page_size=2)
    for page in D.result.get("results", []):
        page_id = page["id"]
        if page_id in notion_offset:
            if page["last_edited_time"] == notion_offset[page_id]:
                continue
        pages.append(page)

    # Pagination
    if D.result["has_more"]:
        D.find_all_page(database_id=database_id, start_cursor=D.result["next_cursor"])
        for page in D.result.get("results", []):
            page_id = page["id"]
            if page["last_edited_time"] != notion_offset[page_id]:
                pages.append(page)
    return pages


NOTION_DIR = Path(__file__).parent
SITE_DIR = NOTION_DIR.parent
BLOG_DIR = SITE_DIR.joinpath("data", "blog")

notion_offset_file = NOTION_DIR.joinpath("notion_offset.json")
notion_config_file = NOTION_DIR.joinpath("notion.json")

notion_config = json.loads(notion_config_file.read_text(encoding="utf8")) if notion_config_file.exists() else {}


def read_notion_offset():
    if notion_offset_file.exists():
        with open(notion_offset_file, encoding="utf8") as f:
            return json.load(f)
    return {}


notion_offset = read_notion_offset()

# notion_offset = {
#     # "73992ec9-e56b-49a9-8a59-bf43bf23246c": "2024-06-17T03:44:00.000Z",
#     "1181724f-52c1-8053-abed-ea322ec3de99": "2024-10-07T09:20:00.000Z"
# }


def update_notion_offset(page):
    notion_offset[page["id"]] = page["last_edited_time"]


def write_notion_offset():
    with open(notion_offset_file, "w", encoding="utf8") as f:
        json.dump(notion_offset, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    pages = []
    databases_id = notion_config.get("databases_id", [])

    for database_id in databases_id:
        pages += get_all_updated_pages(database_id)

    for page in pages:
        page_id = page["id"]
        content_md = StringExporter(block_id=page_id, output_path="/tmp").export()
        props = get_post_properties(page)
        title = props["title"]
        post_md_file = BLOG_DIR.joinpath(f"{title}.md")
        prop_md = gen_post_properties_md(props)
        post_content = prop_md + "\n\n" + content_md
        post_md_file.write_text(post_content, encoding="utf8")
        update_notion_offset(page)

    write_notion_offset()
