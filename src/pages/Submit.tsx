import { useState, type FormEvent } from 'react'
import { usePageMeta } from '../lib/meta'
import { submitWebsite } from '../services/db'
import { backendEnabled } from '../lib/config'
import { Field } from '../components/Field'
import { CheckIcon } from '../components/Icons'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Submit() {
  usePageMeta('Submit Websites', 'Suggest a website for the Browse directory.')
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [comment, setComment] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    let link = url.trim()
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`
    try {
      new URL(link)
    } catch {
      setError('Enter a valid website link.')
      return
    }
    setState('sending')
    try {
      await submitWebsite({ email: email.trim(), url: link, comment: comment.trim() })
      setState('done')
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Something went wrong — try again.')
    }
  }

  return (
    <div className="shell">
      <section className="pt-16 max-w-[640px] mx-auto text-center">
        <h1 className="type-display">Submit Website</h1>
        <p className="type-lede text-text-muted mt-4">
          A high-quality website curation is the most important aspect for us. We can’t list all
          sites since it’s a highly curated directory.
        </p>
      </section>

      <section className="max-w-[640px] mx-auto mt-12">
        {state === 'done' ? (
          <div className="rounded-[10px] ring-hairline bg-surface-raised p-6">
            <div className="flex items-center gap-2.5">
              <CheckIcon className="text-text-primary" />
              <p className="type-compact text-text-primary">Submission received.</p>
            </div>
            <p className="type-caption text-text-muted mt-2">
              We review every suggestion — thanks for keeping the index sharp.
              {!backendEnabled && ' (Demo mode: stored in this browser until Supabase is connected.)'}
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-5" noValidate>
            <Field label="Email" required htmlFor="submit-email">
              <input
                id="submit-email"
                type="email"
                className="input-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Website Link" required htmlFor="submit-url">
              <input
                id="submit-url"
                type="url"
                className="input-base"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </Field>
            <Field label="Comment" htmlFor="submit-comment">
              <textarea
                id="submit-comment"
                className="input-base resize-y min-h-[96px]"
                placeholder="What do you like about this site?"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Field>
            {error && (
              <p className="type-caption text-text-primary font-medium" role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={state === 'sending'} className="btn-cta self-start">
              {state === 'sending' ? 'Submitting…' : 'Submit Website'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
