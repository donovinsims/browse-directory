import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'appwrite'
import { usePageMeta } from '../lib/meta'
import { getDatabases } from '../lib/appwrite'
import { APPWRITE_DB, COLLECTIONS } from '../lib/config'
import { useAuth } from '../providers/AuthProvider'
import { useAdmin } from '../lib/useAdmin'
import { useToast } from '../providers/ToastProvider'
import { DemoNotice } from '../components/DemoNotice'
import { ArrowUpRightIcon, CheckIcon } from '../components/Icons'
import type { Submission, SubmissionStatus } from '../lib/types'

const FILTERS: { key: 'all' | SubmissionStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const base = 'inline-flex items-center gap-1 h-6 px-2.5 rounded-full type-caption'
  if (status === 'approved')
    return (
      <span className={`${base} bg-surface-muted text-text-primary ring-hairline`}>
        <CheckIcon size={11} /> Approved
      </span>
    )
  if (status === 'rejected')
    return <span className={`${base} ring-hairline text-text-muted`}>Rejected</span>
  return <span className={`${base} ring-hairline text-text-muted`}>Pending</span>
}

export function Admin() {
  usePageMeta('Admin — Submissions')
  const { enabled, loading: authLoading, user } = useAuth()
  const { loading: adminLoading, isAdmin } = useAdmin()
  const { toast } = useToast()

  const [rows, setRows] = useState<Submission[] | null>(null)
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all')
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const db = getDatabases()
    if (!db) return
    const res = await db.listDocuments(APPWRITE_DB, COLLECTIONS.submissions, [
      Query.orderDesc('$createdAt'),
      Query.limit(200),
    ])
    setRows(
      res.documents.map((d) => ({
        id: d.$id,
        email: d.email as string,
        url: d.url as string,
        comment: (d.comment as string) ?? '',
        status: ((d.status as string) ?? 'pending') as SubmissionStatus,
        createdAt: d.$createdAt,
      })),
    )
  }, [])

  useEffect(() => {
    if (isAdmin) void load()
  }, [isAdmin, load])

  const setStatus = async (id: string, status: SubmissionStatus) => {
    const db = getDatabases()
    if (!db) return
    setBusy(id)
    const prev = rows
    setRows((r) => r?.map((x) => (x.id === id ? { ...x, status } : x)) ?? r)
    try {
      await db.updateDocument(APPWRITE_DB, COLLECTIONS.submissions, id, { status })
    } catch {
      setRows(prev ?? null)
      toast('Could not update — try again.')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (id: string) => {
    const db = getDatabases()
    if (!db) return
    setBusy(id)
    const prev = rows
    setRows((r) => r?.filter((x) => x.id !== id) ?? r)
    try {
      await db.deleteDocument(APPWRITE_DB, COLLECTIONS.submissions, id)
    } catch {
      setRows(prev ?? null)
      toast('Could not delete — try again.')
    } finally {
      setBusy(null)
    }
  }

  const visible = useMemo(
    () => (rows ?? []).filter((r) => filter === 'all' || r.status === filter),
    [rows, filter],
  )
  const counts = useMemo(() => {
    const c = { all: rows?.length ?? 0, pending: 0, approved: 0, rejected: 0 }
    for (const r of rows ?? []) c[r.status]++
    return c
  }, [rows])

  // ── Access states ───────────────────────────────────────────────────────
  if (!enabled)
    return (
      <div className="shell">
        <section className="pt-16 max-w-[480px] mx-auto">
          <h1 className="type-section">Admin</h1>
          <div className="mt-8">
            <DemoNotice />
          </div>
        </section>
      </div>
    )

  if (authLoading || adminLoading)
    return (
      <div className="shell">
        <p className="pt-16 type-body text-text-muted text-center">Checking access…</p>
      </div>
    )

  if (!user)
    return (
      <div className="shell">
        <section className="pt-16 max-w-[420px] mx-auto text-center">
          <h1 className="type-section">Admin</h1>
          <p className="type-caption text-text-muted mt-3">Sign in with an admin account to continue.</p>
          <Link to="/signin" className="btn-cta mt-8 inline-flex">
            Sign in
          </Link>
        </section>
      </div>
    )

  if (!isAdmin)
    return (
      <div className="shell">
        <section className="pt-16 max-w-[480px] mx-auto text-center">
          <h1 className="type-section">Admin</h1>
          <p className="type-lede text-text-muted mt-4">You don’t have admin access.</p>
          <p className="type-caption text-text-muted mt-2">
            Ask an owner to add you to the “admins” team in Appwrite.
          </p>
          <Link to="/" className="btn-secondary mt-8">
            Back to the index
          </Link>
        </section>
      </div>
    )

  // ── Admin dashboard ─────────────────────────────────────────────────────
  return (
    <div className="shell">
      <section className="pt-16 max-w-[900px] mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="type-section">Submissions</h1>
            <p className="type-caption text-text-muted mt-2">
              {counts.all} total · {counts.pending} pending
            </p>
          </div>
          <button type="button" className="btn-chrome ring-hairline" onClick={() => void load()}>
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`btn-chrome ${filter === f.key ? 'btn-chip-selected' : ''}`}
            >
              {f.label}
              <span className="text-text-muted">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[11px] ring-hairline overflow-hidden">
          {rows === null ? (
            <p className="p-6 type-body text-text-muted">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="p-6 type-body text-text-muted">
              {counts.all === 0 ? 'No submissions yet.' : 'Nothing in this filter.'}
            </p>
          ) : (
            visible.map((s, i) => (
              <div
                key={s.id}
                className={`p-4 tablet:p-5 flex flex-col gap-3 tablet:flex-row tablet:items-center ${
                  i > 0 ? 'hairline-t' : ''
                }`}
              >
                <div className="min-w-0 tablet:flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="type-label text-text-primary truncate">{s.email}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 type-caption text-text-muted transition-standard hover:text-text-primary"
                  >
                    {domainOf(s.url)} <ArrowUpRightIcon size={12} />
                  </a>
                  {s.comment && <p className="type-caption text-text-muted mt-1 max-w-[560px]">{s.comment}</p>}
                </div>

                <div className="flex items-center gap-2 tablet:shrink-0">
                  <span className="type-caption text-text-muted mr-1 hidden tablet:inline">
                    {fmtDate(s.createdAt)}
                  </span>
                  <button
                    type="button"
                    disabled={busy === s.id || s.status === 'approved'}
                    onClick={() => void setStatus(s.id, 'approved')}
                    className={`btn-chrome ring-hairline ${s.status === 'approved' ? 'btn-chip-selected' : ''}`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busy === s.id || s.status === 'rejected'}
                    onClick={() => void setStatus(s.id, 'rejected')}
                    className={`btn-chrome ring-hairline ${s.status === 'rejected' ? 'btn-chip-selected' : ''}`}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={busy === s.id}
                    onClick={() => void remove(s.id)}
                    className="btn-chrome text-text-muted hover:text-text-primary"
                    aria-label="Delete submission"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
