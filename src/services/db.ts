import { ID, Query, AppwriteException } from 'appwrite'
import { getDatabases } from '../lib/appwrite'
import { APPWRITE_DB, COLLECTIONS, backendEnabled } from '../lib/config'
import { sites as localSites } from '../data/sites'
import type { Site } from '../lib/types'

/**
 * Data access with graceful fallback:
 * — Appwrite connected → read/write real collections (falling back to the
 *   local seed if the sites collection is empty or unreachable).
 * — Demo mode → local seed + localStorage, so the site is fully usable
 *   before any backend exists.
 */

export async function fetchSites(): Promise<Site[]> {
  const db = getDatabases()
  if (!db) return localSites
  try {
    const res = await db.listDocuments(APPWRITE_DB, COLLECTIONS.sites, [
      Query.orderAsc('sort'),
      Query.limit(500),
    ])
    if (res.documents.length === 0) return localSites
    return res.documents.map((d) => ({
      slug: d.slug as string,
      name: d.name as string,
      category: d.category_slug as string,
      categoryLabel: d.category_label as string,
      url: d.url as string,
      thumb: d.thumb as string,
      sort: (d.sort as number) ?? 0,
    }))
  } catch {
    return localSites
  }
}

export interface SubmissionInput {
  email: string
  url: string
  comment: string
}

const LS_SUBMISSIONS = 'browse.demo.submissions'
const LS_SUBSCRIBERS = 'browse.demo.subscribers'

export async function submitWebsite(input: SubmissionInput): Promise<{ demo: boolean }> {
  const db = getDatabases()
  if (!db) {
    const rows = JSON.parse(localStorage.getItem(LS_SUBMISSIONS) ?? '[]') as unknown[]
    rows.push({ ...input, created_at: new Date().toISOString() })
    localStorage.setItem(LS_SUBMISSIONS, JSON.stringify(rows))
    return { demo: true }
  }
  await db.createDocument(APPWRITE_DB, COLLECTIONS.submissions, ID.unique(), {
    email: input.email,
    url: input.url,
    comment: input.comment || '',
  })
  return { demo: false }
}

export async function subscribeEmail(email: string): Promise<{ demo: boolean }> {
  const db = getDatabases()
  if (!db) {
    const rows = JSON.parse(localStorage.getItem(LS_SUBSCRIBERS) ?? '[]') as string[]
    if (!rows.includes(email)) rows.push(email)
    localStorage.setItem(LS_SUBSCRIBERS, JSON.stringify(rows))
    return { demo: true }
  }
  try {
    await db.createDocument(APPWRITE_DB, COLLECTIONS.subscribers, ID.unique(), { email })
  } catch (err) {
    // Duplicate email (unique index) is a success from the user's view.
    if (err instanceof AppwriteException && err.code === 409) return { demo: false }
    throw err
  }
  return { demo: false }
}

export { backendEnabled }
