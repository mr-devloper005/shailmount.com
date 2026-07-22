'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'border border-[var(--editable-border)] bg-[#f7f2e9] px-4 py-3 text-sm font-bold text-[#17130e] outline-none transition placeholder:text-[#65451F]/55 focus:border-[var(--slot4-accent)] focus:ring-1 focus:ring-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-4 pb-16 pt-32 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_30px_90px_rgba(0,0,0,.32)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center border border-[var(--editable-border)] bg-[#0b0d0c] text-[var(--slot4-accent)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.12em] text-[#17130e]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[.12em] hover:border-[var(--slot4-accent)]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative mx-auto max-w-[var(--editable-container)] overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-12 lg:pb-24">
          <span className="dot-field -left-16 top-20" />
          <div className="relative grid gap-8 border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_30px_90px_rgba(0,0,0,.32)] lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <aside>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
            </aside>

            <form onSubmit={submit} className="border border-[var(--editable-border)] bg-[#0b0d0c] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.06em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent-secondary)]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent)]">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[var(--slot4-accent)] px-6 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#17130e] transition hover:bg-[var(--slot4-accent-secondary)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
