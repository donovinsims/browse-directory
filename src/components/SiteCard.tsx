import { Link } from 'react-router-dom'
import type { Site } from '../lib/types'
import { useBookmarks } from '../providers/BookmarksProvider'
import { useToast } from '../providers/ToastProvider'
import { useAuth } from '../providers/AuthProvider'
import { ArrowUpRightIcon } from './Icons'
import { BookmarkIconButton } from './ui/bookmark-icon-button'

export function SiteCard({ site }: { site: Site }) {
  const { isBookmarked, toggle } = useBookmarks()
  const { user } = useAuth()
  const { toast } = useToast()
  const saved = isBookmarked(site.slug)

  const onToggle = () => {
    void toggle(site.slug)
    if (!saved && !user) toast('Bookmarked — saved in this browser. Sign in to sync.')
  }

  return (
    <div className="group relative">
      <Link to={`/site/${site.slug}`} className="block transition-standard hover:opacity-90">
        {/* Media-first tile: hairline ring + inset shading on the media only */}
        <div className="aspect-[4/3] rounded-[6px] media-frame overflow-hidden bg-surface-muted">
          <img
            src={site.thumb}
            alt={`${site.name} website thumbnail`}
            loading="lazy"
            className="w-full h-full object-cover rounded-[inherit]"
          />
        </div>
        <div className="relative mt-2 flex h-6 items-center gap-1.5 pr-[54px]">
          <span className="type-label text-text-primary truncate">{site.name}</span>
          <span className="type-caption text-text-muted opacity-60">·</span>
          <span className="type-caption text-text-muted whitespace-nowrap">
            {site.categoryLabel}
          </span>
          {/* View-details affordance — always visible */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted transition-standard group-hover:text-text-primary">
            <ArrowUpRightIcon size={16} />
          </span>
        </div>
      </Link>
      {/* Bookmark toggle — always visible, animated */}
      <BookmarkIconButton
        saved={saved}
        onToggle={onToggle}
        label={saved ? `Remove ${site.name} from bookmarks` : `Bookmark ${site.name}`}
        className="absolute right-[26px] bottom-0"
      />
    </div>
  )
}
