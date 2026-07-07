import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import { DemoNotice } from '../components/DemoNotice'

export function Account() {
  usePageMeta('Account')
  const { enabled, loading, user, profile, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (enabled && !loading && !user) void navigate('/signin')
  }, [enabled, loading, user, navigate])

  const onUpgrade = () => {
    // STRIPE PLACEHOLDER — checkout intentionally stubbed.
    toast('Payments are coming soon — checkout is a placeholder in this build.')
  }

  return (
    <div className="shell">
      <section className="pt-16 max-w-[480px] mx-auto">
        <h1 className="type-section">Account</h1>

        {!enabled ? (
          <div className="mt-8">
            <DemoNotice />
          </div>
        ) : !user ? null : (
          <>
            <div className="mt-8 rounded-[11px] ring-hairline">
              <div className="flex items-center justify-between gap-4 p-5">
                <span className="type-label text-text-muted">Email</span>
                <span className="type-label text-text-primary truncate">{user.email}</span>
              </div>
              <div className="hairline-t flex items-center justify-between gap-4 p-5">
                <span className="type-label text-text-muted">Plan</span>
                <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-surface-raised ring-hairline type-caption text-text-primary">
                  {profile?.is_pro ? 'Bookmarking' : 'Free'}
                </span>
              </div>
              {!profile?.is_pro && (
                <div className="hairline-t p-5 flex flex-col gap-2">
                  <button type="button" className="btn-cta w-full" onClick={onUpgrade}>
                    Upgrade to Bookmarking — $8/mo
                  </button>
                  <p className="type-caption text-text-muted">
                    Payments coming soon — bookmarking is free while checkout is stubbed.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-chrome ring-hairline mt-6"
              onClick={() => {
                void signOut().then(() => navigate('/'))
              }}
            >
              Sign out
            </button>
          </>
        )}
      </section>
    </div>
  )
}
