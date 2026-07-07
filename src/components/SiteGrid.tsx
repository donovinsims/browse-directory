import type { Site } from '../lib/types'
import { SiteCard } from './SiteCard'

export function SiteGrid({ sites }: { sites: Site[] }) {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-5">
      {sites.map((s) => (
        <SiteCard key={s.slug} site={s} />
      ))}
    </div>
  )
}
