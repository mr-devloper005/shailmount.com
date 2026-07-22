import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { fetchTaskPostBySlug, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const searchSlug = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    return decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
  } catch {
    return trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
}
const queryText = (value: string) => {
  try {
    const url = new URL(value.trim())
    return decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '').replace(/-/g, ' ').toLowerCase()
  } catch {
    return value.trim().toLowerCase()
  }
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  // compactRaw only trims — it does NOT strip HTML — so the raw payload could leak markup
  // into the card summary. Route every candidate through toPlainText so cards stay plain,
  // and fall back to the article body when there's no dedicated summary/description.
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_70px_rgba(0,0,0,.35)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-black ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 bg-[var(--slot4-accent)] px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#17130e]">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="bg-[var(--slot4-accent-soft)] px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{taskLabel}</span> : null}
        <h2 className="mt-4 line-clamp-3 text-2xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = queryText(query)
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const feedPosts = feed?.posts?.length ? feed.posts : enabledTasks.flatMap((item) => getMockPostsForTask(item.key))
  const slug = searchSlug(query)
  const canResolveExactPost = Boolean(slug) && (query.includes('/') || query.trim().split(/\s+/).length >= 4)
  const exactPosts = canResolveExactPost
    ? (await Promise.all(enabledTasks.map((item) => fetchTaskPostBySlug(item.key, slug)))).filter((post): post is SitePost => Boolean(post))
    : []
  const posts = Array.from(new Map([...exactPosts, ...feedPosts].map((post) => [post.slug || post.id, post])).values())
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const browseRoute = enabledTasks[0]?.route || '/'

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative mx-auto max-w-[var(--editable-container)] overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-12 lg:pb-24">
          <span className="dot-field -right-16 top-20" />
          <div className="relative grid gap-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.32)] md:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end border border-[var(--editable-border)] bg-[#0b0d0c] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-[var(--editable-border)] bg-[#f7f2e9] px-4 py-3 text-[#17130e] focus-within:border-[var(--slot4-accent)]">
                <Search className="h-5 w-5 text-[#765827]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-[#65451F]/55" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 border border-[var(--editable-border)] bg-[#f7f2e9] px-4 py-3 text-[#17130e] focus-within:border-[var(--slot4-accent)]">
                  <Filter className="h-4 w-4 text-[#765827]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#65451F]/55" />
                </label>
                <select name="task" defaultValue={task} className="border border-[var(--editable-border)] bg-[#f7f2e9] px-4 py-3 text-sm font-black text-[#17130e] outline-none focus:border-[var(--slot4-accent)]">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center bg-[var(--slot4-accent)] px-6 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#17130e] transition hover:bg-[var(--slot4-accent-secondary)]" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href={browseRoute} className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[.12em] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center">
              <p className="text-2xl font-black uppercase tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
