// Centralised API client for BytesDoc backend.
// Falls back to mock data automatically if the backend is unreachable.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// ─── Token helpers ──────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  if (authenticated) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = `API error ${res.status}`
    try {
      const body = await res.json()
      message = body.error ?? message
    } catch {}
    throw new Error(message)
  }

  // For CSV / blob responses
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('text/csv') || ct.includes('application/octet-stream')) {
    return res.blob() as unknown as T
  }

  return res.json() as Promise<T>
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string) {
  return apiFetch<{ user: import('@/types').User; token: string }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    false
  )
}

export async function apiLogout() {
  return apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' })
}

export async function apiMe() {
  return apiFetch<import('@/types').User>('/auth/me')
}

// ─── Documents ──────────────────────────────────────────────────────────────

export interface DocumentsQuery {
  category?: string
  administration?: string
  archived?: boolean
  q?: string
}

export async function apiGetDocuments(query: DocumentsQuery = {}) {
  const params = new URLSearchParams()
  if (query.category) params.set('category', query.category)
  if (query.administration) params.set('administration', query.administration)
  if (query.archived !== undefined) params.set('archived', String(query.archived))
  if (query.q) params.set('q', query.q)
  const qs = params.toString()
  return apiFetch<import('@/types').Document[]>(`/documents${qs ? `?${qs}` : ''}`)
}

export async function apiGetDocument(id: string) {
  return apiFetch<import('@/types').Document>(`/documents/${id}`)
}

export async function apiUploadDocument(
  file: File,
  meta: { title: string; category: string; event: string; administration: string; fileType: string }
) {
  const form = new FormData()
  form.append('file', file)
  Object.entries(meta).forEach(([k, v]) => form.append(k, v))
  return apiFetch<import('@/types').Document>('/documents', { method: 'POST', body: form })
}

export async function apiUpdateDocument(
  id: string,
  patch: Partial<{ title: string; category: string; event: string; administration: string }>
) {
  return apiFetch<import('@/types').Document>(`/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  })
}

export async function apiDeleteDocument(id: string) {
  return apiFetch<void>(`/documents/${id}`, { method: 'DELETE' })
}

export async function apiDownloadDocument(id: string) {
  return apiFetch<{ url: string; expiresInSec: number }>(`/documents/${id}/download`)
}

// ─── Archive ────────────────────────────────────────────────────────────────

export async function apiArchiveDocument(id: string) {
  return apiFetch<{ ok: boolean }>(`/documents/${id}/archive`, { method: 'POST' })
}

export async function apiBulkArchive(administration: string) {
  return apiFetch<{ ok: boolean; archivedCount: number }>('/documents/bulk-archive', {
    method: 'POST',
    body: JSON.stringify({ administration }),
  })
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function apiGetUsers() {
  return apiFetch<import('@/types').User[]>('/users')
}

export async function apiCreateUser(payload: {
  id: string
  email: string
  name: string
  role: import('@/types').Role
}) {
  return apiFetch<import('@/types').User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateUserRole(userId: string, role: import('@/types').Role) {
  return apiFetch<import('@/types').User>(`/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

// ─── Activity Logs ──────────────────────────────────────────────────────────

export interface ActivityLogsQuery {
  userId?: string
  action?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface ActivityLogEntry {
  id: string
  userId: string
  userName: string | null
  userEmail: string | null
  action: string
  documentId: string | null
  documentTitle: string | null
  timestamp: string
}

export interface ActivityLogsResponse {
  logs: ActivityLogEntry[]
  total: number
  page: number
  limit: number
}

export async function apiGetActivityLogs(query: ActivityLogsQuery = {}) {
  const params = new URLSearchParams()
  if (query.userId) params.set('userId', query.userId)
  if (query.action) params.set('action', query.action)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  const qs = params.toString()
  return apiFetch<ActivityLogsResponse>(`/activity-logs${qs ? `?${qs}` : ''}`)
}

export async function apiExportActivityLogs(query: ActivityLogsQuery = {}): Promise<Blob> {
  const params = new URLSearchParams()
  if (query.userId) params.set('userId', query.userId)
  if (query.action) params.set('action', query.action)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  const qs = params.toString()
  return apiFetch<Blob>(`/activity-logs/export${qs ? `?${qs}` : ''}`)
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalDocuments: number
  activeDocuments: number
  archivedDocuments: number
  recentUploads: number
  myUploads: number
  docsPerCategory: { name: string; value: number }[]
  uploadsOverTime: { name: string; value: number }[]
  recentDocuments: {
    id: string
    title: string
    category: string
    uploadDate: string
    uploaderName: string
  }[]
  activitySummary: {
    uploads: number
    downloads: number
    views: number
    logins: number
  } | null
}

export async function apiGetDashboardStats() {
  return apiFetch<DashboardStats>('/dashboard/stats')
}

// ─── Backend health check ────────────────────────────────────────────────────

export async function apiHealthCheck(): Promise<boolean> {
  try {
    await apiFetch<{ ok: boolean }>('/health', {}, false)
    return true
  } catch {
    return false
  }
}