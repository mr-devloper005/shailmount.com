'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const tasks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const { session, logout } = useEditableLocalAuthSession()
  return (
    <footer className="relative border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <span className="dot-field -right-16 -top-24" />
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-[var(--slot4-accent)]">The work starts here</p>
            <Link href="/contact" className="group mt-5 flex max-w-4xl items-end justify-between border-b border-white/15 pb-5 text-[clamp(2.7rem,7vw,7rem)] font-black uppercase leading-[.85] tracking-[-.07em] hover:text-[var(--slot4-accent)]">Let&apos;s connect <ArrowUpRight className="mb-2 h-8 w-8 shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-14 sm:w-14" /></Link>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 border-l-0 border-white/10 lg:border-l lg:pl-10">
            <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/35">Browse</p><div className="mt-4 grid gap-3">{tasks.map((task) => <Link key={task.key} href={task.route} className="text-sm font-semibold hover:text-[var(--slot4-accent)]">{task.label}</Link>)}</div></div>
            <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/35">Access</p><div className="mt-4 grid gap-3 text-sm font-semibold"><Link href="/about" className="hover:text-[var(--slot4-accent)]">About</Link><Link href="/contact" className="hover:text-[var(--slot4-accent)]">Contact</Link>{session ? <><Link href="/create">Create</Link><button onClick={logout} className="text-left">Logout</button></> : <><Link href="/login">Login</Link><Link href="/signup">Sign up</Link></>}</div></div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[.16em] text-white/35 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} {SITE_CONFIG.name}</span><span>Built for useful connections · All rights reserved</span></div>
      </div>
    </footer>
  )
}
