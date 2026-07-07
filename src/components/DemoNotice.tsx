import { Link } from 'react-router-dom'

/** Shown on auth pages while Appwrite env vars are absent. */
export function DemoNotice() {
  return (
    <div className="rounded-[10px] ring-hairline bg-surface-raised p-5">
      <p className="type-label text-text-primary">Membership isn’t connected yet</p>
      <p className="type-caption text-text-muted mt-2">
        This build is running in demo mode. Bookmarks still work (saved in this browser). To enable
        real accounts, set <code>VITE_APPWRITE_ENDPOINT</code> and{' '}
        <code>VITE_APPWRITE_PROJECT_ID</code> from your Appwrite project — full steps in the{' '}
        <Link to="/start-here-delete-later" className="text-text-primary hover:opacity-80">
          setup guide
        </Link>
        .
      </p>
    </div>
  )
}
