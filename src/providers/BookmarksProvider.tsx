import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { ID, Query, Permission, Role } from 'appwrite'
import { getDatabases } from '../lib/appwrite'
import { APPWRITE_DB, COLLECTIONS } from '../lib/config'
import { useAuth } from './AuthProvider'

const LS_KEY = 'browse.bookmarks'

interface BookmarksState {
  bookmarks: Set<string>
  isBookmarked: (slug: string) => boolean
  toggle: (slug: string) => Promise<void>
  /** True when bookmarks live only in this browser (no account). */
  isLocal: boolean
}

const BookmarksContext = createContext<BookmarksState | null>(null)

function readLocal(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  // Start empty so server-render and first client-render match (SSG hydration);
  // browser-local bookmarks load in the effect below.
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set())
  // slug -> Appwrite document $id (only populated when signed in)
  const docIds = useRef<Map<string, string>>(new Map())
  const isLocal = !user

  useEffect(() => {
    const db = getDatabases()
    if (!db || !user) {
      docIds.current = new Map()
      setBookmarks(readLocal())
      return
    }
    let alive = true
    ;(async () => {
      try {
        const res = await db.listDocuments(APPWRITE_DB, COLLECTIONS.bookmarks, [
          Query.equal('userId', user.$id),
          Query.limit(500),
        ])
        const map = new Map<string, string>()
        for (const d of res.documents) map.set(d.siteSlug as string, d.$id)

        // Merge any browser-local bookmarks up into the account once.
        const local = readLocal()
        for (const slug of local) {
          if (map.has(slug)) continue
          try {
            const created = await db.createDocument(
              APPWRITE_DB,
              COLLECTIONS.bookmarks,
              ID.unique(),
              { userId: user.$id, siteSlug: slug },
              [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
              ],
            )
            map.set(slug, created.$id)
          } catch {
            /* ignore dup/permission races */
          }
        }
        if (local.size > 0) localStorage.removeItem(LS_KEY)
        if (!alive) return
        docIds.current = map
        setBookmarks(new Set(map.keys()))
      } catch {
        if (alive) setBookmarks(readLocal())
      }
    })()
    return () => {
      alive = false
    }
  }, [user])

  const toggle = useCallback(
    async (slug: string) => {
      const db = getDatabases()
      const adding = !bookmarks.has(slug)
      const next = new Set(bookmarks)
      if (adding) next.add(slug)
      else next.delete(slug)
      setBookmarks(next) // optimistic

      if (db && user) {
        try {
          if (adding) {
            const created = await db.createDocument(
              APPWRITE_DB,
              COLLECTIONS.bookmarks,
              ID.unique(),
              { userId: user.$id, siteSlug: slug },
              [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id)),
              ],
            )
            docIds.current.set(slug, created.$id)
          } else {
            const id = docIds.current.get(slug)
            if (id) {
              await db.deleteDocument(APPWRITE_DB, COLLECTIONS.bookmarks, id)
              docIds.current.delete(slug)
            }
          }
        } catch {
          setBookmarks(bookmarks) // revert on failure
        }
      } else {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]))
      }
    },
    [bookmarks, user],
  )

  const isBookmarked = useCallback((slug: string) => bookmarks.has(slug), [bookmarks])

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggle, isLocal }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks(): BookmarksState {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks must be used inside BookmarksProvider')
  return ctx
}
