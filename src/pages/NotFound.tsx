import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'

export function NotFound() {
  usePageMeta('Page not found')
  return (
    <div className="shell">
      <section className="pt-16 text-center flex flex-col items-center">
        <h1 className="type-display">404</h1>
        <p className="type-lede text-text-muted mt-4">This page doesn’t exist.</p>
        <Link to="/" className="btn-secondary mt-10">
          Back to the index
        </Link>
      </section>
    </div>
  )
}
