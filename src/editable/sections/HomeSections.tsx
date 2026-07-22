import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Search, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = { primaryTask: TaskKey; primaryRoute: string; posts: SitePost[]; timeSections: HomeTimeSection[] }
const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12'

function poolOf(posts: SitePost[], sections: HomeTimeSection[]) {
  const seen = new Set<string>()
  return [...posts, ...sections.flatMap((section) => section.posts)].filter((post) => {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function validImage(post?: SitePost) {
  if (!post) return ''
  const image = getEditablePostImage(post)
  return image.includes('placeholder') ? '' : image
}

function SafeImage({ post, className = '' }: { post?: SitePost; className?: string }) {
  const image = validImage(post)
  return image ? <img src={image} alt="" className={className} /> : <div className={`bg-[radial-gradient(circle_at_30%_25%,#EAC696_0%,#C8AE7D_12%,#765827_32%,#65451F_48%,#202422_72%,#0b0d0c)] ${className}`} aria-hidden="true" />
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf(posts, timeSections)
  const lead = pool[0]
  const side = pool[1]
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#0b0d0c] pt-24 text-white sm:min-h-[880px]">
      <SafeImage post={lead} className="absolute inset-0 h-full w-full object-cover opacity-65" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,.25),rgba(5,7,6,.28)_42%,rgba(5,7,6,.96))]" />
      <span className="dot-field -left-8 top-24" /><span className="dot-field left-[28%] top-[38%] hidden sm:block" />
      <div className={`relative flex min-h-[680px] flex-col justify-end pb-8 sm:min-h-[780px] ${container}`}>
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[var(--slot4-accent)]">[ practical people · serious work ]</p>
            <h1 className="mt-8 max-w-5xl text-[clamp(3.3rem,7.5vw,7.4rem)] font-black uppercase leading-[.82] tracking-[-.075em]">Ideas, offers and people built for business.</h1>
          </div>
          <div className="border-l border-white/25 pl-6">
            <p className="text-xl font-semibold leading-7">Find useful opportunities, capable professionals and clear business stories—without the noise.</p>
            <form action="/search" className="mt-6 flex border-b border-[var(--slot4-accent)] pb-2">
              <Search className="mr-3 h-5 w-5 text-[var(--slot4-accent)]" /><input name="q" placeholder="What are you looking for?" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/55" /><button className="font-mono text-[10px] font-bold uppercase">Search +</button>
            </form>
          </div>
        </div>
        <div className="mt-14 grid gap-4 border-t border-white/35 pt-5 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-white/75 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_2fr]">
          <span>Independent business index</span><span>{SITE_CONFIG.name}</span><span><i className="mr-2 inline-block h-2 w-2 bg-[var(--slot4-accent)]" />Always discovering</span>
          <div className="flex flex-wrap gap-x-5 lg:justify-end">{SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 3).map((task) => <Link key={task.key} href={task.route} className="hover:text-[var(--slot4-accent)]">{task.label} +</Link>)}</div>
        </div>
      </div>
      {side ? <Link href={postHref(primaryTask, side, primaryRoute)} className="absolute right-5 top-28 hidden w-52 border border-white/10 bg-[#0b0d0c]/90 p-3 backdrop-blur lg:block"><div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase"><span>On our radar</span><span>( + )</span></div><SafeImage post={side} className="mt-4 aspect-[4/5] w-full object-cover grayscale transition hover:grayscale-0" /><p className="mt-3 line-clamp-2 text-sm font-bold">{side.title}</p></Link> : null}
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = poolOf(posts, timeSections).slice(0, 4)
  if (!items.length) return null
  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-page-bg)] py-16 sm:py-24">
      <div className={container}>
        <div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[var(--slot4-accent)]">Selected signals</p><h2 className="mt-3 text-4xl font-black uppercase tracking-[-.06em] sm:text-6xl">Worth a closer look.</h2></div><Link href={primaryRoute} className="hidden border border-[var(--editable-border)] px-5 py-3 font-mono text-[10px] font-bold uppercase hover:border-[var(--slot4-accent)] sm:block">Full index ( + )</Link></div>
        <div className="mt-12 border-t border-[var(--editable-border)]">
          {items.map((post, index) => <Link key={post.slug || post.id} href={postHref(primaryTask, post, primaryRoute)} className="group grid min-h-44 gap-5 border-b border-[var(--editable-border)] py-6 sm:grid-cols-[48px_1fr_150px] lg:grid-cols-[70px_1fr_440px] lg:items-center"><span className="font-mono text-[10px] text-white/35">0{index + 1}</span><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p><h3 className="mt-3 text-2xl font-bold uppercase leading-none tracking-[-.04em] transition group-hover:text-[var(--slot4-accent)] sm:text-3xl">{post.title}</h3><p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 145) || 'Open this post for the full details.'}</p></div><SafeImage post={post} className="h-32 w-full object-cover transition duration-700 group-hover:scale-[1.02]" /></Link>)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = poolOf(posts, timeSections).slice(4, 9)
  if (!items.length) return null
  const featured = items[0]
  return (
    <section className="relative bg-[var(--slot4-panel-bg)] py-16 sm:py-24"><span className="dot-field right-[18%] top-0" />
      <div className={container}>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <Link href={postHref(primaryTask, featured, primaryRoute)} className="group relative min-h-[540px] overflow-hidden"><SafeImage post={featured} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(7,8,7,.92))]" /><div className="absolute inset-x-0 bottom-0 p-7 sm:p-10"><p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-[var(--slot4-accent)]">Featured perspective</p><h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.9] tracking-[-.06em] sm:text-6xl">{featured.title}</h2><span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase">Open story <ArrowUpRight className="h-4 w-4" /></span></div></Link>
          <div className="grid gap-px bg-[var(--editable-border)] sm:grid-cols-2 lg:grid-cols-1">{items.slice(1).map((post, index) => <Link key={post.slug || post.id} href={postHref(primaryTask, post, primaryRoute)} className="group flex min-h-32 gap-4 bg-[var(--slot4-surface-bg)] p-4"><SafeImage post={post} className="h-24 w-24 shrink-0 object-cover" /><div className="min-w-0"><p className="font-mono text-[9px] uppercase text-[var(--slot4-accent)]">Dispatch 0{index + 1}</p><h3 className="mt-2 line-clamp-2 text-lg font-bold uppercase leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3><p className="mt-2 line-clamp-1 text-xs text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 80)}</p></div></Link>)}</div>
        </div>
      </div>
    </section>
  )
}

const labels: Record<string, string> = { spotlight: 'Fresh this week', browse: 'Active this month', index: 'From the archive' }
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length ? timeSections : [{ key: 'spotlight', posts: posts.slice(9, 15), href: primaryRoute }, { key: 'browse', posts: posts.slice(15, 21), href: primaryRoute }] as HomeTimeSection[]
  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null
  return <>{visible.map((section, sectionIndex) => <section key={section.key} className="border-t border-[var(--editable-border)] py-14 sm:py-20"><div className={container}><div className="flex items-end justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[.2em] text-[var(--slot4-accent)]">Collection 0{sectionIndex + 1}</p><h2 className="mt-2 text-3xl font-black uppercase tracking-[-.05em] sm:text-5xl">{labels[section.key] || 'More to explore'}</h2></div><Link href={section.href || primaryRoute} className="font-mono text-[9px] font-bold uppercase hover:text-[var(--slot4-accent)]">View all ( + )</Link></div><div className="mt-9 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">{section.posts.slice(0, 8).map((post, index) => <Link key={post.slug || post.id} href={postHref(primaryTask, post, primaryRoute)} className={`group shrink-0 snap-start border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] ${index % 3 === 0 ? 'w-[330px]' : 'w-[260px]'}`}><SafeImage post={post} className={`w-full object-cover ${index % 3 === 0 ? 'aspect-[4/3]' : 'aspect-square'}`} /><div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p><h3 className="mt-3 line-clamp-2 text-xl font-bold uppercase leading-tight group-hover:text-[var(--slot4-accent)]">{post.title}</h3></div></Link>)}</div></div></section>)}</>
}

export function EditableHomeCta() {
  return <section className="relative overflow-hidden bg-[var(--slot4-accent)] py-16 text-[#17130e] sm:py-24"><span className="dot-field -right-10 top-0 !opacity-20" /><div className={`${container} relative grid items-end gap-8 lg:grid-cols-[1fr_auto]`}><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em]">Have something useful?</p><h2 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-[.86] tracking-[-.07em] sm:text-7xl">Bring your work into the conversation.</h2></div><div className="flex flex-wrap gap-3"><Link href="/create" className="inline-flex items-center gap-2 bg-[#17130e] px-6 py-4 font-mono text-[10px] font-bold uppercase text-white">Create a post <ArrowRight className="h-4 w-4" /></Link><Link href="/profile" className="inline-flex items-center gap-2 border border-[#17130e] px-6 py-4 font-mono text-[10px] font-bold uppercase"><UserRound className="h-4 w-4" />Browse profiles</Link></div></div></section>
}
