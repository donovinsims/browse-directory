import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSites } from '../lib/useSites'
import { usePageMeta } from '../lib/meta'
import { categories } from '../data/categories'
import { CategoryFilter } from '../components/CategoryFilter'
import { SortMenu, type SortKey } from '../components/SortMenu'
import { SiteGrid } from '../components/SiteGrid'
import { EmailCapture } from '../components/EmailCapture'
import { NotFound } from './NotFound'

export function Gallery() {
  const { slug } = useParams()
  const sites = useSites()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('curated')

  const category = slug ? categories.find((c) => c.slug === slug) : undefined

  usePageMeta(
    category ? category.name : undefined,
    category
      ? `Hand-picked ${category.name} websites, curated by Browse.`
      : 'A hand-curated directory of exceptional websites across software, design, AI, and more.',
  )

  const visible = useMemo(() => {
    let list = sites
    if (category) list = list.filter((s) => s.category === category.slug)
    const needle = q.trim().toLowerCase()
    if (needle)
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(needle) ||
          s.categoryLabel.toLowerCase().includes(needle),
      )
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name))
    return list
  }, [sites, category, q, sort])

  if (slug && !category) return <NotFound />

  const countLabel = `${visible.length} ${visible.length === 1 ? 'site' : 'sites'}${
    category ? ` in ${category.name}` : ''
  }${q.trim() ? ` matching “${q.trim()}”` : ''}`

  return (
    <div className="shell">
      {/* Hero — centered, value-forward */}
      <section className="pt-16 text-center">
        <h1 className="type-display mx-auto max-w-[880px]">The best-designed sites on the web.</h1>
        <p className="type-lede text-text-muted mt-5 max-w-[560px] mx-auto">
          A hand-curated directory across software, design, AI, and more — find your next
          inspiration, then bookmark what you love.
        </p>
        <div className="mt-10 flex justify-center">
          <EmailCapture />
        </div>
      </section>

      {/* Filter chrome — centered pills on desktop, Filter dropdown on mobile */}
      <section className="mt-12 tablet:mt-16">
        <CategoryFilter active={category?.slug} query={q} onQuery={setQ} />

        {/* Result count + sort */}
        <div className="flex items-center justify-between gap-3 mt-8 mb-5">
          <p className="type-caption text-text-muted">{countLabel}</p>
          <SortMenu value={sort} onChange={setSort} />
        </div>

        {visible.length > 0 ? (
          <SiteGrid sites={visible} />
        ) : (
          <p className="type-body text-text-muted py-16 text-center">
            No sites match “{q}”. Try a different search.
          </p>
        )}

        <p className="type-caption text-text-muted mt-10 text-center">
          All screenshots are copyrighted by their respective owners.
        </p>
      </section>
    </div>
  )
}
