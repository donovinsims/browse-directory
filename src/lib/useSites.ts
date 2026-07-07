import { useEffect, useState } from 'react'
import { fetchSites } from '../services/db'
import { sites as localSites } from '../data/sites'
import type { Site } from './types'

/**
 * Renders the local seed instantly, then swaps in Supabase rows when
 * connected — stale-while-revalidate, so there is never a blank grid.
 */
export function useSites(): Site[] {
  const [sites, setSites] = useState<Site[]>(localSites)
  useEffect(() => {
    let alive = true
    void fetchSites().then((s) => {
      if (alive) setSites(s)
    })
    return () => {
      alive = false
    }
  }, [])
  return sites
}
