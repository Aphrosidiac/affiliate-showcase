import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'

export default function DashboardLayout() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 text-neutral-600 hover:text-neutral-900"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-neutral-900">AffiShowcase</h1>
        </header>

        <main className="p-4 lg:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
