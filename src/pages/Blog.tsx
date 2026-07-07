import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { posts, blogOrder } from '../data/blog'

const ordered = blogOrder
  .map((slug) => posts.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

export function Blog() {
  usePageMeta('Blog', 'Further resources made by Browse.')
  return (
    <div className="shell">
      <section className="pt-16 text-center">
        <h1 className="type-display">Blog</h1>
        <p className="type-lede text-text-muted mt-4 max-w-[640px] mx-auto">
          Discover further resources made by Browse.
        </p>
      </section>

      <section className="mt-12 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-5">
          {ordered.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-[6px] media-frame overflow-hidden bg-surface-muted transition-standard group-hover:opacity-90">
                <img
                  src={post.cover}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[inherit]"
                />
              </div>
              <p className="type-compact text-text-primary mt-3 transition-standard group-hover:opacity-90">
                {post.title}
              </p>
              <p className="type-caption text-text-muted mt-1">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
