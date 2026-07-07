import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { useAuth } from '../providers/AuthProvider'
import { Field } from '../components/Field'
import { DemoNotice } from '../components/DemoNotice'

export function SignIn() {
  usePageMeta('Sign in')
  const { enabled, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      void navigate('/bookmarks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell">
      <section className="pt-16 max-w-[400px] mx-auto">
        <h1 className="type-section">Sign in</h1>
        <p className="type-caption text-text-muted mt-3">
          Welcome back — your bookmarks are waiting.
        </p>

        {!enabled && (
          <div className="mt-8">
            <DemoNotice />
          </div>
        )}

        <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-4 mt-8" noValidate>
          <Field label="Email" required htmlFor="si-email">
            <input
              id="si-email"
              type="email"
              className="input-base"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!enabled}
              required
            />
          </Field>
          <Field label="Password" required htmlFor="si-pass">
            <input
              id="si-pass"
              type="password"
              className="input-base"
              placeholder="Your password"
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
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="type-caption text-text-muted mt-5">
          No account?{' '}
          <Link to="/signup" className="text-text-primary hover:opacity-80">
            Sign up
          </Link>
        </p>
      </section>
    </div>
  )
}
