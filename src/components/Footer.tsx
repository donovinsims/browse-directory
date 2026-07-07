import { Link } from 'react-router-dom'

const COLS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Index',
    links: [
      { to: '/', label: 'Websites' },
      { to: '/blog', label: 'Blog' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/submit', label: 'Submit' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/bookmarks', label: 'Bookmarks' },
      { to: '/signin', label: 'Sign in' },
      { to: '/signup', label: 'Sign up' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-[120px] desktop:mt-[160px]">
      <div className="shell hairline-t">
        <div className="flex flex-col tablet:flex-row gap-10 tablet:gap-20 pt-10">
          <div className="max-w-[320px]">
            <p className="type-compact text-text-primary">Browse</p>
            <p className="type-caption text-text-muted mt-2">
              A hand-curated directory of exceptional websites across software, design, and the
              open web.
            </p>
          </div>
          <div className="flex gap-16 tablet:ml-auto">
            {COLS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="type-caption text-text-muted">{col.title}</p>
                {col.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="type-label text-text-primary transition-standard hover:text-text-muted"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col tablet:flex-row gap-2 tablet:gap-6 py-10 mt-6">
          <p className="type-caption text-text-muted">
            All screenshots are copyrighted by their respective owners.
          </p>
          <p className="type-caption text-text-muted tablet:ml-auto">
            © {new Date().getFullYear()} Browse — demo content; replace with your own.
          </p>
        </div>
      </div>
    </footer>
  )
}
