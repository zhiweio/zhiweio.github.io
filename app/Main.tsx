import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 15

export default function Home({ posts }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            I'm{' '}
            <span className="dark:from-secondary-700 dark:to-secondary-400 mt-10 bg-gradient-to-r from-primary-700 to-primary-400 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              wang zhiwei
            </span>{' '}
            👋
          </h1>
          <div className="dark:text-grey text-gray mb-8  mt-4 text-base">
            <p>Data Engineer, CLI User.</p>
            <p>
              我是一名数据研发工程师，热爱命令行与开源，主要使用 Python 和 SQL，也写 Shell、Java/Scala，正在通过 Vide coding 实践全栈开发，探索 AI Agent 的可能性。
            </p>
            <p className="dark:text-grey text-gray mb-8   mt-4 text-sm">
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#Data Engineering</span>
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#Data Architect</span>
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#AWS</span>
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#Azure</span>
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#Full Stack</span>
              <span className="mr-3 inline-block whitespace-nowrap pt-3">#DataOps</span>
            </p>
          </div>

          <p className="text-gray dark:text-gray text-lg leading-7">{siteMetadata.description}</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-6">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
