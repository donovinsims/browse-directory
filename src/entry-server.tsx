import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { sites } from './data/sites'
import { categories } from './data/categories'
import { posts } from './data/blog'

const SITE = 'Browse'

/** Render a route to static HTML for prerendering. */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

export interface PrerenderRoute {
  path: string
  title: string
  description: string
}

/** Public routes to prerender, each with SEO title + description. */
export function getRoutes(): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [
    {
      path: '/',
      title: `${SITE} — The best-designed sites on the web`,
      description:
        'A hand-curated directory of exceptional websites across software, design, AI, and more. Browse by category, save your favorites, and find your next inspiration.',
    },
    { path: '/pricing', title: `Pricing | ${SITE}`, description: 'Browse for free, or unlock bookmarking to save sites to your account.' },
    { path: '/submit', title: `Submit Websites | ${SITE}`, description: 'Suggest a website for the Browse directory.' },
    { path: '/blog', title: `Blog | ${SITE}`, description: 'Further resources made by Browse.' },
  ]
  for (const c of categories)
    routes.push({
      path: `/category/${c.slug}`,
      title: `${c.name} | ${SITE}`,
      description: `Hand-picked ${c.name} websites, curated by Browse.`,
    })
  for (const s of sites)
    routes.push({
      path: `/site/${s.slug}`,
      title: `${s.name} | ${SITE}`,
      description: `${s.name} — ${s.categoryLabel} in the Browse directory of exceptional websites.`,
    })
  for (const p of posts)
    routes.push({
      path: `/blog/${p.slug}`,
      title: `${p.title} – Blog | ${SITE}`,
      description: p.excerpt,
    })
  return routes
}
