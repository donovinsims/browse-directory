import { useState, type FormEvent } from 'react'
import { subscribeEmail } from '../services/db'
import { backendEnabled } from '../lib/config'
import { CheckIcon } from './Icons'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setState('error')
      return
    }
    setState('sending')
    try {
      await subscribeEmail(email.trim())
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="w-full max-w-[560px] min-h-[57px] rounded-[14px] bg-surface-raised ring-control flex items-center justify-center gap-2.5 px-5 py-4">
        <CheckIcon className="text-text-primary" />
        <span className="type-compact text-text-primary">You’re on the list.</span>
        {!backendEnabled && (
          <span className="type-caption text-text-muted hidden tablet:inline">
            (demo — stored in this browser)
          </span>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="w-full max-w-[560px]" noValidate>
      {/*
        Mobile: input + full-width CTA stacked (embedded overlay is too cramped
        on narrow screens). Tablet+: oversized 57px input with the CTA embedded
        on the right, per the design system's hero-input variant.
      */}
      <div className="flex flex-col gap-2 tablet:relative tablet:block tablet:gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder="Enter your email"
          aria-label="Email address"
          className="w-full h-[57px] rounded-[14px] bg-surface-raised ring-control px-5 tablet:pr-[240px] text-[15px] tracking-[-0.1px] text-text-primary placeholder:text-text-muted outline-none transition-standard focus:[box-shadow:inset_0_0_0_1px_var(--border-strong)]"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="btn-cta w-full h-[49px] px-5 tablet:w-auto tablet:h-[45px] tablet:absolute tablet:right-[8px] tablet:top-1/2 tablet:-translate-y-1/2"
        >
          {state === 'sending' ? 'Joining…' : 'Get Our Weekly Picks'}
        </button>
      </div>
      {state === 'error' ? (
        <p className="type-caption text-text-primary mt-2 text-center tablet:text-left" role="alert">
          Enter a valid email address.
        </p>
      ) : (
        <p className="type-caption text-text-muted mt-2.5 text-center tablet:text-left">
          A short weekly email of new standouts. No spam — unsubscribe anytime.
        </p>
      )}
    </form>
  )
}
