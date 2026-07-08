import { useEffect, useState } from 'react'
import { getTeams } from './appwrite'
import { useAuth } from '../providers/AuthProvider'

const ADMIN_TEAM = 'admins'

/** True when the signed-in user belongs to the Appwrite `admins` team. */
export function useAdmin(): { loading: boolean; isAdmin: boolean } {
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, isAdmin: false })

  useEffect(() => {
    const teams = getTeams()
    if (!teams || !user) {
      setState({ loading: false, isAdmin: false })
      return
    }
    let alive = true
    teams
      .list()
      .then((res) => {
        if (alive) setState({ loading: false, isAdmin: res.teams.some((t) => t.$id === ADMIN_TEAM) })
      })
      .catch(() => alive && setState({ loading: false, isAdmin: false }))
    return () => {
      alive = false
    }
  }, [user])

  return state
}
