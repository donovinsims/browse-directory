import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { useAuth } from '../providers/AuthProvider'
import { Field } from '../components/Field'
import { DemoNotice } from '../components/DemoNotice'

export function SignUp() {
  usePageMeta('Sign up')
  const { enabled, signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const wantsBookmarking = params.get('plan') === 'bookmarking'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setBusy(true)
    try {
      await signUp(email.trim(), password)
      void navigate('/bookmarks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell">
      <section className="pt-16 max-w-[400px] mx-auto">
        <h1 className="type-section">Create your account</h1>
        <p className="type-caption text-text-muted mt-3">
          {wantsBookmarking
            ? 'Bookmarking is $8/month — free while payments are being wired up.'
            : 'Free to join. Bookmark sites and keep your finds in one place.'}
        </p>

        {!enabled && (
          <div className="mt-8">
            <DemoNotice />
          </div>
        )}

        <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-4 mt-8" noValidate>
          <Field label="Email" required htmlFor="su-email">
            <input
              id="su-email"
              type="email"
              className="input-base"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!enabled}
              required
            />
          </Field>
          <Field label="Password" required htmlFor="su-pass">
            <input
              id="su-pass"
              type="password"
              className="input-base"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!enabled}
              required
            />
          </Field>
          {error && (
            <p className="type-caption text-text-primary font-medium" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-cta w-full" disabled={!enabled || busy}>
            {busy ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="type-caption text-text-muted mt-5">
          Have an account?{' '}
          <Link to="/signin" className="text-text-primary hover:opacity-80">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  )
}
