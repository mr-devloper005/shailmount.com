'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile').map((task) => ({ label: task.label, href: task.route })), [])

  return (
    <header className="relative z-50 h-0 text-[var(--editable-nav-text)]">
      <nav className="fixed left-1/2 top-4 z-50 flex h-[68px] w-[calc(100%-2rem)] max-w-[585px] -translate-x-1/2 items-center justify-between border border-white/5 bg-[var(--editable-nav-bg)]/95 px-4 shadow-[0_22px_60px_rgba(0,0,0,.35)] backdrop-blur-xl sm:top-6 sm:px-5">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${SITE_CONFIG.name} home`}>
          <span className="grid h-9 w-9 grid-cols-2 gap-1 p-1.5" aria-hidden="true">
            <i className="bg-[var(--slot4-accent)]" /><i className="mt-2 bg-[var(--slot4-accent)]" /><i className="ml-2 bg-[var(--slot4-accent)]" /><i />
          </span>
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[.18em] text-white/60 sm:block">{SITE_CONFIG.name}</span>
        </Link>

        <p className="absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[.08em] text-white/80 sm:block">
          {pathname === '/' ? 'Built for bold business' : 'Explore the index'}
        </p>

        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center text-white transition hover:text-[var(--slot4-accent)]" aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0b0d0c]/98 px-5 pb-10 pt-28 backdrop-blur-xl">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_.7fr]">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[var(--slot4-accent)]">Navigate</p>
              <div className="mt-6 grid border-t border-white/10">
                {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item, index) => {
                  const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
                  return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`group flex items-center justify-between border-b border-white/10 py-4 text-3xl font-black uppercase tracking-[-.05em] sm:text-5xl ${active ? 'text-[var(--slot4-accent)]' : 'text-white hover:text-[var(--slot4-accent)]'}`}><span><small className="mr-4 align-middle font-mono text-[9px] font-normal tracking-normal text-white/35">{String(index + 1).padStart(2, '0')}</small>{item.label}</span><ArrowUpRight className="h-6 w-6 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
                })}
              </div>
            </div>
            <div className="lg:pt-10">
              <form action="/search" className="flex border border-white/15 bg-white/[.03] p-2">
                <Search className="mx-3 h-5 w-5 self-center text-[var(--slot4-accent)]" />
                <input name="q" type="search" placeholder="SEARCH THE DIRECTORY" className="min-w-0 flex-1 bg-transparent py-3 font-mono text-xs outline-none placeholder:text-white/35" />
                <button className="bg-[var(--slot4-accent)] px-4 font-mono text-[10px] font-bold uppercase text-[#17130e]">Go</button>
              </form>
              <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] font-bold uppercase tracking-[.12em]">
                {session ? <><Link href="/create" onClick={() => setOpen(false)} className="border border-white/15 px-4 py-3 hover:border-[var(--slot4-accent)]">Create post</Link><button onClick={logout} className="border border-white/15 px-4 py-3 hover:border-[var(--slot4-accent)]">Logout</button></> : <><Link href="/login" onClick={() => setOpen(false)} className="border border-white/15 px-4 py-3 hover:border-[var(--slot4-accent)]">Login</Link><Link href="/signup" onClick={() => setOpen(false)} className="bg-[var(--slot4-accent)] px-4 py-3 text-[#17130e]">Join the network</Link></>}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
