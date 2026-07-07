import { Link, useParams } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { posts, blogOrder } from '../data/blog'
import { NotFound } from './NotFound'

export function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  usePageMeta(post ? `${post.title} – Blog` : 'Blog', post?.excerpt)

  if (!post) return <NotFound />

  const idx = blogOrder.indexOf(post.slug)
  const nextSlug = blogOrder[(idx + 1) % blogOrder.length]
  const next = posts.find((p) => p.slug === nextSlug)

  return (
    <div className="shell">
      <article className="max-w-[640px] mx-auto pt-16">
        <Link
          to="/blog"
          className="type-label text-text-muted transition-standard hover:text-text-primary"
        >
          ← Blog
        </Link>
        <p className="type-caption text-text-muted mt-8">{post.date}</p>
        <h1 className="type-display mt-3">{post.title}</h1>

        <div className="mt-10 rounded-[10px] media-frame overflow-hidden bg-surface-muted">
          <img src={post.cover} alt="" className="w-full h-auto block rounded-[inherit]" />
        </div>

        <div className="mt-10">
          {post.blocks.map((b, i) =>
            b.type === 'h2' ? (
              <h2 key={i} className="type-section mt-12 mb-5">
                {b.text}
              </h2>
            ) : (
              <p key={i} className="type-body text-text-primary mb-4">
                {b.text}
              </p>
            ),
          )}
        </div>

        {next && (
          <aside className="mt-16 pt-10 hairline-t">
            <p className="type-aside">Next up</p>
            <Link to={`/blog/${next.slug}`} className="group flex items-center gap-5 mt-5">
              <div className="w-[160px] shrink-0 aspect-[4/3] rounded-[6px] media-frame overflow-hidden bg-surface-muted transition-standard group-hover:opacity-90">
                <img
                  src={next.cover}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[inherit]"
                />
              </div>
              <div>
                <p className="type-compact text-text-primary">{next.title}</p>
                <p className="type-caption text-text-muted mt-1">{next.date}</p>
              </div>
            </Link>
          </aside>
        )}
      </article>
    </div>
  )
}
