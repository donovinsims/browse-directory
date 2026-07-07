import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSites } from '../lib/useSites'
import { usePageMeta } from '../lib/meta'
import { categories } from '../data/categories'
import { CategoryFilter } from '../components/CategoryFilter'
import { SiteGrid } from '../components/SiteGrid'
import { EmailCapture } from '../components/EmailCapture'
import { NotFound } from './NotFound'

export function Gallery() {
  const { slug } = useParams()
  const sites = useSites()
  const [q, setQ] = useState('')

  const category = slug ? categories.find((c) => c.slug === slug) : undefined

  usePageMeta(
    category ? category.name : undefined,
    category
      ? `Hand-picked ${category.name} websites, curated by Browse.`
      : 'A hand-curated directory of exceptional websites.',
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
    return list
  }, [sites, category, q])

  if (slug && !category) return <NotFound />

  return (
    <div className="shell">
      {/* Hero — centered column */}
      <section className="pt-16 text-center">
        <h1 className="type-display mx-auto max-w-[880px]">
          The Advanced Curation &amp; Directory Template
        </h1>
        <div className="mt-10 flex justify-center">
          <EmailCapture />
        </div>
      </section>

      {/* Filter chrome — centered pills on desktop, Filter dropdown on mobile */}
      <section className="mt-12 tablet:mt-16">
        <CategoryFilter active={category?.slug} query={q} onQuery={setQ} />

        <div className="mt-6">
          {visible.length > 0 ? (
            <SiteGrid sites={visible} />
          ) : (
            <p className="type-body text-text-muted py-16 text-center">
              No sites match “{q}”. Try a different search.
            </p>
          )}
        </div>

        <p className="type-caption text-text-muted mt-10 text-center">
          All screenshots are copyrighted by their respective owners.
        </p>
      </section>
    </div>
  )
}
