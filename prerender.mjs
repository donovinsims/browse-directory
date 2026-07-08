// Static prerender: render every public route to HTML and emit a sitemap.
// Runs after `vite build` (client) + `vite build --ssr` (server bundle).
import fs from 'node:fs'
import path from 'node:path'
import { render, getRoutes } from './dist-server/entry-server.js'

const BASE = process.env.SITE_URL || 'https://browse-directory.vercel.app'
const template = fs.readFileSync('dist/index.html', 'utf8')
const routes = getRoutes()

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function page(html, title, description) {
  const t = esc(title)
  const d = esc(description)
  let out = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  // Newline-tolerant tag replacement (Vite keeps the source's multi-line meta tags).
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
  out = out.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`)
  out = out.replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`)
  out = out.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${d}" />`,
  )
  return out
}

let count = 0
for (const r of routes) {
  let html = ''
  try {
    html = render(r.path)
  } catch (err) {
    console.error(`prerender failed for ${r.path}:`, err?.message)
    continue
  }
  const dir = r.path === '/' ? 'dist' : path.join('dist', r.path)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), page(html, r.title, r.description))
  count++
}

// sitemap.xml
const urls = routes
  .map((r) => `  <url><loc>${BASE}${r.path === '/' ? '' : r.path}</loc></url>`)
  .join('\n')
fs.writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)

console.log(`prerendered ${count}/${routes.length} routes + sitemap.xml`)
