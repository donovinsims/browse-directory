import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export function CategoryPills({ active }: { active?: string }) {
  return (
    <nav className="contents" aria-label="Categories">
      <Link to="/" className={`btn-chrome ${!active ? 'btn-chip-selected' : ''}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={`/category/${c.slug}`}
          className={`btn-chrome ${active === c.slug ? 'btn-chip-selected' : ''}`}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  )
}
