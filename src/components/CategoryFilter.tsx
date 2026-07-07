import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { CategoryPills } from './CategoryPills'
import { SearchField } from './SearchField'
import { ChevronUpDownIcon } from './Icons'

interface Props {
  active?: string
  query: string
  onQuery: (v: string) => void
}

/**
 * Desktop/tablet: centered pill row with the search tucked to the right.
 * Mobile: pills collapse into a "Filter" dropdown (per the reference), with
 * search sharing the row.
 */
export function CategoryFilter({ active, query, onQuery }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const activeCat = categories.find((c) => c.slug === active)

  // Close on route change (active slug changes) and on outside click / Escape.
  useEffect(() => setOpen(false), [active])
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const items = [{ slug: '', name: 'All', to: '/' }, ...categories.map((c) => ({ ...c, to: `/category/${c.slug}` }))]

  return (
    <>
      {/* Tablet+ : centered pills + right-aligned search */}
      <div className="relative hidden tablet:block">
        <div className="flex flex-wrap justify-center gap-2">
          <CategoryPills active={active} />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <SearchField value={query} onChange={onQuery} />
        </div>
      </div>

      {/* Mobile : Filter dropdown + search */}
      <div className="flex items-center gap-2 tablet:hidden">
        <div className="relative shrink-0" ref={ref}>
          <button
            type="button"
            className="btn-chrome ring-hairline h-9 px-3"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((v) => !v)}
          >
            {activeCat ? activeCat.name : 'Filter'}
            <ChevronUpDownIcon className="text-text-muted" />
          </button>
          {open && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+6px)] z-40 min-w-[220px] rounded-[11px] ring-hairline shadow-float bg-surface-base p-2 appear"
            >
              {items.map((it) => {
                const isActive = (it.slug || undefined) === active
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setOpen(false)}
                    className={`block rounded-[6px] px-3 py-2 type-body transition-standard ${
                      isActive
                        ? 'btn-chip-selected text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {it.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex-1">
          <SearchField value={query} onChange={onQuery} />
        </div>
      </div>
    </>
  )
}
