import { SearchIcon } from './Icons'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function SearchField({ value, onChange }: Props) {
  return (
    <label className="flex h-8 items-center gap-2 rounded-[6px] bg-surface-raised ring-control px-3 w-full tablet:w-[200px] transition-standard focus-within:[box-shadow:inset_0_0_0_1px_var(--border-strong)]">
      <SearchIcon className="text-text-muted shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search sites"
        aria-label="Search sites"
        className="w-full bg-transparent type-control text-text-primary placeholder:text-text-muted outline-none"
      />
    </label>
  )
}
