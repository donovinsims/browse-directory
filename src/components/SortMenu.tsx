import { useEffect, useRef, useState } from 'react'
import { ChevronUpDownIcon, CheckIcon } from './Icons'

export type SortKey = 'curated' | 'az' | 'za'

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'curated', label: 'Curated' },
  { key: 'az', label: 'A–Z' },
  { key: 'za', label: 'Z–A' },
]

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = OPTIONS.find((o) => o.key === value) ?? OPTIONS[0]

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

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        className="btn-chrome ring-hairline h-8"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-text-muted">Sort:</span> {current.label}
        <ChevronUpDownIcon className="text-text-muted" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-40 min-w-[160px] rounded-[11px] ring-hairline shadow-float bg-surface-base p-2 appear"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={o.key === value}
              onClick={() => {
                onChange(o.key)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between gap-2 rounded-[6px] px-3 py-2 type-body transition-standard ${
                o.key === value
                  ? 'btn-chip-selected text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {o.label}
              {o.key === value && <CheckIcon size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
