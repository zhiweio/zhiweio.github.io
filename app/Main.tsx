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
        <div className="relative space-y-6 pb-12 pt-8 md:space-y-8 md:pb-16 md:pt-12">
          {/* 背景装饰 */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="to-secondary-100 dark:to-secondary-900 absolute -right-32 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary-100 opacity-20 blur-3xl dark:from-primary-900 dark:opacity-10"></div>
            <div className="from-secondary-100 dark:from-secondary-900 absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr to-primary-100 opacity-20 blur-3xl dark:to-primary-900 dark:opacity-10"></div>
          </div>

          {/* 主标题区域 */}
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="mb-2 block">Hi, I'm</span>
              <span className="relative inline-block">
                <span className="dark:from-secondary-700 dark:to-secondary-400 bg-gradient-to-r from-primary-700 to-primary-400 bg-clip-text text-transparent">
                  Wang Zhiwei
                </span>
                <span className="ml-2 text-4xl sm:text-5xl md:text-6xl">👋</span>
              </span>
            </h1>

            {/* 副标题 */}
            <div className="mx-auto max-w-3xl space-y-4">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 sm:text-2xl">
                Data Engineer & CLI Enthusiast
              </p>

              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
                我是一名数据研发工程师，热爱命令行与开源，主要使用 Python 和 SQL，也写
                Shell、Java/Scala，正在通过 Vide coding 实践全栈开发，探索 AI Agent 的可能性。
              </p>
            </div>
          </div>

          {/* 技能标签 */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {['Data Engineering', 'Data Architect', 'AWS', 'Azure', 'Full Stack', 'DataOps'].map(
              (skill) => (
                <span
                  key={skill}
                  className="to-secondary-50 dark:to-secondary-900/20 inline-flex items-center rounded-full bg-gradient-to-r from-primary-50 px-4 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200 transition-all duration-200 hover:scale-105 hover:shadow-md dark:from-primary-900/20 dark:text-primary-300 dark:ring-primary-800"
                >
                  #{skill}
                </span>
              )
            )}
          </div>

          {/* 描述文字 */}
          <div className="pt-6 text-center">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
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
