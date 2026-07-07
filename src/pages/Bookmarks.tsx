import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { useSites } from '../lib/useSites'
import { useBookmarks } from '../providers/BookmarksProvider'
import { useAuth } from '../providers/AuthProvider'
import { SiteGrid } from '../components/SiteGrid'

export function Bookmarks() {
  usePageMeta('Your Bookmarks', 'Sites you have saved on Browse.')
  const sites = useSites()
  const { bookmarks, isLocal } = useBookmarks()
  const { enabled } = useAuth()

  const saved = sites.filter((s) => bookmarks.has(s.slug))

  return (
    <div className="shell">
      <section className="pt-16 text-center">
        <h1 className="type-display">Your Bookmarks</h1>
        {saved.length > 0 && isLocal && (
          <p className="type-caption text-text-muted mt-3">
            Saved in this browser.{' '}
            {enabled ? (
              <>
                <Link to="/signup" className="text-text-primary hover:opacity-80">
                  Create an account
                </Link>{' '}
                to sync them.
              </>
            ) : (
              'Connect Supabase to sync bookmarks to accounts.'
            )}
          </p>
        )}
      </section>

      <section className="mt-12">
        {saved.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center gap-6">
            <p className="type-card-title">Looks empty down here!</p>
            <Link to="/" className="btn-secondary">
              Browse more sites
            </Link>
          </div>
        ) : (
          <SiteGrid sites={saved} />
        )}
      </section>
    </div>
  )
}
