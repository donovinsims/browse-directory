import { useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useSites } from '../lib/useSites'
import { usePageMeta } from '../lib/meta'
import { categories } from '../data/categories'
import { useBookmarks } from '../providers/BookmarksProvider'
import { SiteGrid } from '../components/SiteGrid'
import { BookmarkIconButton } from '../components/ui/bookmark-icon-button'
import { ArrowLeftIcon, ArrowUpRightIcon, GlobeIcon, TagIcon } from '../components/Icons'
import { NotFound } from './NotFound'

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function DetailRow({ label, children, divider }: { label: string; children: ReactNode; divider?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-4 ${divider ? 'hairline-t' : ''}`}>
      <span className="type-label text-text-muted">{label}</span>
      <span className="type-label text-text-primary flex items-center gap-2">{children}</span>
    </div>
  )
}

export function SiteDetail() {
  const { slug } = useParams()
  const sites = useSites()
  const navigate = useNavigate()
  const { isBookmarked, toggle } = useBookmarks()

  const site = sites.find((s) => s.slug === slug)
  usePageMeta(
    site ? site.name : 'Site',
    site ? `${site.name} — ${site.categoryLabel} in the Browse directory.` : undefined,
  )

  if (sites.length > 0 && !site) return <NotFound />
  if (!site) return null

  const category = categories.find((c) => c.slug === site.category)
  const related = sites.filter((s) => s.category === site.category && s.slug !== site.slug).slice(0, 4)
  const saved = isBookmarked(site.slug)

  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else void navigate('/')
  }

  return (
    <div className="shell pt-8 tablet:pt-10">
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 tablet:gap-12 items-start max-w-[1200px] mx-auto">
        {/* Media */}
        <div className="relative rounded-[11px] media-frame overflow-hidden bg-surface-muted order-1">
          <img
            src={site.thumb}
            alt={`${site.name} website screenshot`}
            className="w-full h-auto aspect-[4/3] object-cover rounded-[inherit]"
          />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-surface-base ring-hairline type-caption text-text-primary">
            <TagIcon size={12} className="text-text-muted" />
            {site.categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="order-2">
          <button type="button" onClick={goBack} className="btn-chrome ring-hairline">
            <ArrowLeftIcon size={14} />
            Back
          </button>

          <h1 className="mt-6 text-[32px] tablet:text-[40px] font-semibold leading-[1.08] tracking-[-1.2px]">
            {site.name}
          </h1>

          {/* Details panel — same register as the pricing tiers */}
          <div className="mt-8 rounded-[11px] ring-hairline bg-surface-raised overflow-hidden">
            <DetailRow label="Category">
              <TagIcon size={14} className="text-text-muted" />
              {site.categoryLabel}
            </DetailRow>
            <DetailRow label="Website" divider>
              <GlobeIcon size={14} className="text-text-muted" />
              {domainOf(site.url)}
            </DetailRow>
          </div>

          <div className="mt-6 flex items-stretch gap-2">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta flex-1"
            >
              Visit website
              <ArrowUpRightIcon size={16} />
            </a>
            <span className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[8px] ring-hairline">
              <BookmarkIconButton
                saved={saved}
                onToggle={() => toggle(site.slug)}
                label={saved ? `Remove ${site.name} from bookmarks` : `Bookmark ${site.name}`}
              />
            </span>
          </div>

          <p className="type-caption text-text-muted mt-4 leading-[1.6]">
            Part of the Browse index — a hand-curated directory of exceptional websites. Opens the
            live site in a new tab.
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 tablet:mt-28 max-w-[1392px] mx-auto">
          <h2 className="type-aside mb-6">More in {category?.name ?? site.categoryLabel}</h2>
          <SiteGrid sites={related} />
        </section>
      )}
    </div>
  )
}
