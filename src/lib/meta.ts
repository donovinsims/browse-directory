import { useEffect } from 'react'

const SITE = 'Browse'

/** Sets document title + meta description for the current page. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} — The Curation & Directory Template`
    if (description) {
      let el = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!el) {
        el = document.createElement('meta')
        el.name = 'description'
        document.head.appendChild(el)
      }
      el.content = description
    }
  }, [title, description])
}
