export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT as string | undefined
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string | undefined

/** Fixed IDs created by appwrite/provision.py. */
export const APPWRITE_DB = 'browse'
export const COLLECTIONS = {
  sites: 'sites',
  submissions: 'submissions',
  subscribers: 'subscribers',
  bookmarks: 'bookmarks',
} as const

/**
 * When the Appwrite endpoint + project id are absent the app runs in DEMO MODE:
 * the catalog renders from the local seed, bookmarks persist in the browser,
 * and auth/submissions explain how to connect.
 */
export const backendEnabled = Boolean(APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID)

/**
 * STRIPE PLACEHOLDER — payments are intentionally not wired yet.
 * When Stripe lands, flip this to true so bookmarking requires the paid plan
 * (stored on the Appwrite account prefs as is_pro).
 */
export const REQUIRE_PLAN_FOR_BOOKMARKS = false
