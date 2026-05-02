import { useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  Eye,
  EyeOff,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  RefreshCw,
  Search,
  Sheet,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import BlogManagement from './BlogManagement'

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: string
  sheetSaved?: boolean
  sheetResponseStatus?: number | null
  sheetResponseBody?: string | null
}

type Visitor = {
  key: string
  name: string
  number: string
  email: string
  deviceInfo?: string
  createdAt?: string | null
  sheetSaved?: boolean
  sheetResponseStatus?: number | null
}

type Lead = {
  sessionKey: string
  firstName: string
  mobile: string
  email: string
  deviceInfo?: string
  createdAt?: string
  lastRequestedAt?: string
  resendCount?: number
  verified?: boolean
  verifiedAt?: string | null
  sheetSaved?: boolean
  sheetResponseStatus?: number | null
  sheetResponseBody?: string | null
  otpAttempts?: number
}

type AdminView = 'dashboard' | 'visitors' | 'messages' | 'blog'

type AdminResponse = {
  leads: Lead[]
  messages?: Message[]
  visitors?: Visitor[]
  stats: {
    total: number
    verified: number
    pending: number
    sheetSynced: number
  }
}

type VisitorsResponse = {
  visitors: Visitor[]
  stats: {
    total: number
    sheetSynced: number
  }
}

type AdminSessionResponse = {
  authenticated: boolean
  username?: string
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

type StatCardProps = {
  title: string
  value: number
  hint: string
  icon: any
  iconClassName: string
}

function StatCard({ title, value, hint, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className={`rounded-xl p-2 ${iconClassName}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function SectionButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: any
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}

function getSectionTitle(view: AdminView) {
  if (view === 'visitors') return 'Visitors'
  if (view === 'messages') return 'Contact Us Data'
  return 'Dashboard'
}

function getSectionSubtitle(view: AdminView) {
  if (view === 'visitors') return 'Live visitor submissions synced from Sheet2.'
  if (view === 'messages') return 'Contact form submissions synced from Sheet1.'
  return 'Overview of both visitor and contact form data.'
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className || ''}`} />
}

function AdminShellSkeleton() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-screen min-h-0">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-hidden border-r border-slate-200 bg-white p-5 shadow-lg lg:static lg:flex">
          <div className="mb-6 flex items-center gap-3">
            <SkeletonBlock className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-4 w-28" />
            </div>
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
          </div>

          <div className="mt-auto pt-6">
            <SkeletonBlock className="h-10 w-full" />
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-lg lg:hidden" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-3 w-56" />
                </div>
              </div>
              <SkeletonBlock className="h-9 w-28 rounded-lg" />
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SkeletonBlock className="h-32 w-full rounded-2xl" />
                <SkeletonBlock className="h-32 w-full rounded-2xl" />
                <SkeletonBlock className="h-32 w-full rounded-2xl" />
                <SkeletonBlock className="h-32 w-full rounded-2xl" />
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-36" />
                      <SkeletonBlock className="h-3 w-56" />
                    </div>
                    <SkeletonBlock className="h-10 w-72 rounded-xl" />
                  </div>

                  <div className="space-y-3">
                    <SkeletonBlock className="h-12 w-full" />
                    <SkeletonBlock className="h-12 w-full" />
                    <SkeletonBlock className="h-12 w-full" />
                    <SkeletonBlock className="h-12 w-full" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-32" />
                    <SkeletonBlock className="h-3 w-48" />
                  </div>

                  <div className="mt-5 space-y-3">
                    <SkeletonBlock className="h-16 w-full" />
                    <SkeletonBlock className="h-16 w-full" />
                    <SkeletonBlock className="h-16 w-full" />
                    <SkeletonBlock className="h-16 w-full" />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminResponse | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLeadKey, setSelectedLeadKey] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<AdminView>('dashboard')

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    'http://localhost:4000'

  const fetchLeads = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError('')

      const [leadsRes, messagesRes, visitorsRes] = await Promise.all([
        fetch(`${backendBaseUrl}/api/admin/leads`, { credentials: 'include' }),
        fetch(`${backendBaseUrl}/api/admin/messages`, { credentials: 'include' }),
        fetch(`${backendBaseUrl}/api/admin/visitors`, { credentials: 'include' }),
      ])

      const payload = (await leadsRes.json()) as AdminResponse
      const msgsPayload = await messagesRes.json()
      const visitorsPayload = (await visitorsRes.json()) as VisitorsResponse

      if (!leadsRes.ok || !messagesRes.ok || !visitorsRes.ok) {
        throw new Error('Failed to load dashboard data')
      }

      setData({ ...payload, messages: msgsPayload.messages, visitors: visitorsPayload.visitors })
      if (payload.leads.length > 0 && !selectedLeadKey) {
        setSelectedLeadKey(payload.leads[0].sessionKey)
      }
    } catch {
      setError('Unable to load dashboard data. Make sure backend is running on port 4000.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const checkAdminSession = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/api/admin/session`, {
        credentials: 'include',
      })

      const payload = (await response.json()) as AdminSessionResponse
      if (response.ok && payload.authenticated) {
        setAuthenticated(true)
        localStorage.setItem('adminAuthenticated', 'true')
        setCheckingAuth(false)
        void fetchLeads()
        return
      } else {
        // Session expired on backend
        setAuthenticated(false)
        localStorage.removeItem('adminAuthenticated')
      }
    } catch {
      // Backend unreachable, check if user was previously authenticated
      const wasAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
      if (wasAuthenticated) {
        // Still show as authenticated in case of temporary backend issue
        setAuthenticated(true)
        setCheckingAuth(false)
        void fetchLeads()
        return
      } else {
        setAuthenticated(false)
      }
    } finally {
      setCheckingAuth(false)
    }
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoginLoading(true)
      setLoginError('')

      const response = await fetch(`${backendBaseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || 'Login failed')
      }

      setAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setLoginUsername('')
      setLoginPassword('')
      await fetchLeads()
    } catch (loginFailure) {
      setLoginError(loginFailure instanceof Error ? loginFailure.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const logout = async () => {
    await fetch(`${backendBaseUrl}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setAuthenticated(false)
    setData(null)
    setSearch('')
    setError('')
    setLoginPassword('')
    setSidebarOpen(false)
    setSelectedLeadKey(null)
    setActiveView('dashboard')
    localStorage.removeItem('adminAuthenticated')
  }

  useEffect(() => {
    const initializeAuth = async () => {
      // First check if we have a cached authenticated state from localStorage
      const cachedAuth = localStorage.getItem('adminAuthenticated') === 'true'
      
      if (cachedAuth) {
        // Try to verify the session with the backend
        await checkAdminSession()
      } else {
        // No cached auth, just finish checking
        setCheckingAuth(false)
      }
    }
    
    initializeAuth()
  }, [])

  const recentVisitors = useMemo(() => {
    const visitors = data?.visitors || []
    return [...visitors].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5)
  }, [data?.visitors])

  const recentMessages = useMemo(() => {
    const messages = data?.messages || []
    return [...messages].sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()).slice(0, 5)
  }, [data?.messages])

  const visitorSheetRows = useMemo(() => {
    const visitors = data?.visitors || []
    const query = search.trim().toLowerCase()

    const rows = visitors.map((visitor) => ({
      key: visitor.key,
      name: visitor.name,
      number: visitor.number,
      email: visitor.email,
      createdAt: visitor.createdAt,
      synced: Boolean(visitor.sheetSaved),
    }))

    if (!query) return rows

    return rows.filter((row) => {
      return [row.name, row.number, row.email].some((field) => String(field).toLowerCase().includes(query))
    })
  }, [data?.visitors, search])

  const stats = data?.stats || { total: 0, verified: 0, pending: 0, sheetSynced: 0 }

  if (checkingAuth) {
    return <AdminShellSkeleton />
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !loginUsername.trim() || !loginPassword.trim()}
              className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="flex h-screen min-h-0">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden border-r border-slate-200 bg-white p-5 shadow-lg transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between lg:justify-start lg:gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ">
                <img src="/favicon.png" alt="" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight text-slate-900">Admin</h2>
              </div>
            </div>
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            <SectionButton active={activeView === 'dashboard'} icon={Home} label="Dashboard" onClick={() => setActiveView('dashboard')} />
            <SectionButton active={activeView === 'visitors'} icon={Users} label="Visitors" onClick={() => setActiveView('visitors')} />
            <SectionButton active={activeView === 'messages'} icon={MessageSquare} label="Contact Us Data" onClick={() => setActiveView('messages')} />
            <SectionButton active={activeView === 'blog'} icon={BookOpen} label="Blog" onClick={() => setActiveView('blog')} />
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={logout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900">{getSectionTitle(activeView)}</h1>
                  <p className="text-xs text-slate-500">{getSectionSubtitle(activeView)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLeads(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {loading && !data && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                Loading dashboard data from Google Sheets...
              </div>
            )}

            {activeView === 'dashboard' ? (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total leads"
                    value={stats.total}
                    hint="All submissions"
                    icon={Users}
                    iconClassName="bg-blue-50 text-blue-700"
                  />
                  <StatCard
                    title="Verified"
                    value={stats.verified}
                    hint="OTP success"
                    icon={BadgeCheck}
                    iconClassName="bg-emerald-50 text-emerald-700"
                  />
                  <StatCard
                    title="Pending"
                    value={stats.pending}
                    hint="Awaiting verification"
                    icon={Clock3}
                    iconClassName="bg-amber-50 text-amber-700"
                  />
                  <StatCard
                    title="Sheet synced"
                    value={stats.sheetSynced}
                    hint="Google Sheets saved"
                    icon={Sheet}
                    iconClassName="bg-violet-50 text-violet-700"
                  />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 p-4 md:p-5">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Recent visitors</h2>
                        <p className="text-sm text-slate-500">Latest Sheet2 rows.</p>
                      </div>
                      <button onClick={() => setActiveView('visitors')} className="text-sm font-medium text-blue-700 hover:text-blue-800">
                        View all
                      </button>
                    </div>
                    {loading && !data ? (
                      <div className="space-y-3 p-4 md:p-5">
                        <SkeletonBlock className="h-12 w-full" />
                        <SkeletonBlock className="h-12 w-full" />
                        <SkeletonBlock className="h-12 w-full" />
                      </div>
                    ) : recentVisitors.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-500">No visitors found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Mobile</th>
                              <th className="px-4 py-3">Email</th>
                              <th className="px-4 py-3">Added</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentVisitors.map((visitor) => (
                              <tr key={visitor.key} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                                <td className="px-4 py-3 font-semibold text-slate-900">{visitor.name}</td>
                                <td className="px-4 py-3 text-slate-700">{visitor.number}</td>
                                <td className="px-4 py-3 text-slate-700">{visitor.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(visitor.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 p-4 md:p-5">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Recent contact us data</h2>
                        <p className="text-sm text-slate-500">Latest Sheet1 rows.</p>
                      </div>
                      <button onClick={() => setActiveView('messages')} className="text-sm font-medium text-blue-700 hover:text-blue-800">
                        View all
                      </button>
                    </div>
                    {loading && !data ? (
                      <div className="space-y-3 p-4 md:p-5">
                        <SkeletonBlock className="h-12 w-full" />
                        <SkeletonBlock className="h-12 w-full" />
                        <SkeletonBlock className="h-12 w-full" />
                      </div>
                    ) : recentMessages.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-500">No contact messages found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                              <th className="px-4 py-3">Name / Email</th>
                              <th className="px-4 py-3">Subject</th>
                              <th className="px-4 py-3">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentMessages.map((msg) => (
                              <tr key={msg.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                                <td className="px-4 py-3">
                                  <p className="font-semibold text-slate-900">{msg.name}</p>
                                  <p className="text-xs text-slate-500">{msg.email}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{msg.subject}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(msg.submittedAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              </>
            ) : activeView === 'messages' ? (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Contact Us Data</h2>
                    <p className="text-sm text-slate-500">Submissions from the Contact Us form.</p>
                  </div>
                </div>

                {loading ? (
                  <div className="grid gap-3 p-4 md:p-5">
                    <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ) : !data?.messages || data.messages.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">No contact messages found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                          <th className="px-4 py-3">Name / Email</th>
                          <th className="px-4 py-3">Subject</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Sheet</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.messages.map((msg) => (
                          <tr key={msg.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-900">{msg.name}</p>
                              <p className="text-xs text-slate-500">{msg.email}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{msg.subject}</td>
                            <td className="px-4 py-3 text-slate-600 max-w-sm truncate" title={msg.message}>{msg.message}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  msg.sheetSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {msg.sheetSaved ? 'Saved to Sheet1' : 'Not saved'}
                              </span>
                              <p className="mt-1 text-xs text-slate-500">
                                Status: {msg.sheetResponseStatus ?? '-'}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(msg.submittedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : activeView === 'blog' ? (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Blog Management</h2>
                    <p className="text-sm text-slate-500">Create, edit, and manage your blog posts.</p>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <BlogManagement isAdmin={authenticated} />
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Visitors</h2>
                    <p className="text-sm text-slate-500">Live Sheet2 visitor rows: name, number, email, and created time.</p>
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500">
                    <Search size={16} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search visitors"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 md:w-72"
                    />
                  </label>
                </div>

                {loading ? (
                  <div className="grid gap-3 p-4 md:p-5">
                    <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ) : visitorSheetRows.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">No visitors found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Number</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Added</th>
                          <th className="px-4 py-3">Sheet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitorSheetRows.map((row) => (
                          <tr key={row.key} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                            <td className="px-4 py-3 font-semibold text-slate-900">{row.name}</td>
                            <td className="px-4 py-3 text-slate-700">{row.number}</td>
                            <td className="px-4 py-3 text-slate-700">{row.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(row.createdAt)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.synced ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                                {row.synced ? 'Saved' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-900/35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
