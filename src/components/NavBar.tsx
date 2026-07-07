import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { MenuIcon, CloseIcon, SendIcon, BookmarkIcon, UserIcon, SignOutIcon } from './Icons'

const LEFT_LINKS = [
  { to: '/', label: 'Websites' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
]

function isWebsitesActive(pathname: string) {
  return pathname === '/' || pathname.startsWith('/category')
}

export function NavBar() {
  const { user, enabled, signOut } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location.pathname])

  const leftClass = (active: boolean) =>
    `btn-chrome ${active ? 'btn-chip-selected text-text-primary' : 'text-text-muted hover:text-text-primary'}`

  return (
    <header className="shell">
      {/* Slim bar in page flow — not sticky, no scroll-state change */}
      <nav className="flex items-center gap-2 py-4" aria-label="Main">
        <Link to="/" className="type-compact text-text-primary mr-3" aria-label="Browse — home">
          Browse
        </Link>

        {/* Desktop / tablet: left links (active = selected chip) */}
        <div className="hidden tablet:flex items-center gap-1">
          {LEFT_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                leftClass(l.to === '/' ? isWebsitesActive(location.pathname) : isActive)
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop / tablet: right cluster (ringed chips with icons) */}
        <div className="hidden tablet:flex items-center gap-2 ml-auto">
          <NavLink
            to="/submit"
            className={({ isActive }) =>
              `btn-chrome ring-hairline ${isActive ? 'btn-chip-selected' : ''}`
            }
          >
            <SendIcon />
            Submit
          </NavLink>
          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              `btn-chrome ring-hairline ${isActive ? 'btn-chip-selected' : ''}`
            }
          >
            <BookmarkIcon />
            Bookmarks
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `btn-chrome ring-hairline ${isActive ? 'btn-chip-selected' : ''}`
                }
              >
                <UserIcon />
                Account
              </NavLink>
              <button
                type="button"
                className="btn-chrome ring-hairline"
                onClick={() => void signOut()}
              >
                <SignOutIcon />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-chrome">
                Sign in
              </Link>
              <Link to="/signup" className="btn-chrome btn-inverse">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Phone: burger, swaps to close in place */}
        <button
          type="button"
          className="btn-chrome ml-auto tablet:hidden w-8 px-0"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Phone: in-place expanding panel */}
      <div
        className="tablet:hidden grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s var(--ease-standard)',
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="flex flex-col pb-4">
            {[
              ...LEFT_LINKS,
              { to: '/submit', label: 'Submit' },
              { to: '/bookmarks', label: 'Bookmarks' },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `py-3 type-body transition-standard ${
                    (l.to === '/' ? isWebsitesActive(location.pathname) : isActive)
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 mt-3">
              {user ? (
                <>
                  <Link to="/account" className="btn-chrome btn-chip-selected w-full">
                    Account
                  </Link>
                  <button
                    type="button"
                    className="btn-chrome ring-hairline w-full"
                    onClick={() => void signOut()}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="btn-chrome btn-chip-selected w-full">
                    Sign in
                  </Link>
                  <Link to="/signup" className="btn-chrome btn-inverse w-full">
                    Sign up
                  </Link>
                </>
              )}
              {!enabled && (
                <p className="type-caption text-text-muted pt-1">
                  Demo mode — membership connects via Supabase.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
