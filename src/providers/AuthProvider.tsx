import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { ID, type Models } from 'appwrite'
import { getAccount } from '../lib/appwrite'
import { backendEnabled } from '../lib/config'
import type { Profile } from '../lib/types'

type AppwriteUser = Models.User<Models.Preferences>

interface AuthState {
  /** True when Appwrite env vars are configured. */
  enabled: boolean
  loading: boolean
  user: AppwriteUser | null
  profile: Profile | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function toProfile(user: AppwriteUser | null): Profile | null {
  if (!user) return null
  return {
    id: user.$id,
    email: user.email || null,
    is_pro: Boolean((user.prefs as Record<string, unknown> | undefined)?.is_pro),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [loading, setLoading] = useState(backendEnabled)

  useEffect(() => {
    const account = getAccount()
    if (!account) return
    account
      .get()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const account = getAccount()
    if (!account) throw new Error('Membership is not connected yet — see the README to add Appwrite.')
    await account.create(ID.unique(), email, password)
    await account.createEmailPasswordSession(email, password)
    setUser(await account.get())
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const account = getAccount()
    if (!account) throw new Error('Membership is not connected yet — see the README to add Appwrite.')
    await account.createEmailPasswordSession(email, password)
    setUser(await account.get())
  }, [])

  const signOut = useCallback(async () => {
    const account = getAccount()
    if (!account) return
    try {
      await account.deleteSession('current')
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ enabled: backendEnabled, loading, user, profile: toProfile(user), signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
