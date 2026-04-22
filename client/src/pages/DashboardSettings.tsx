import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function DashboardSettings() {
  const { user } = useAuth()
  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.store.get()
      .then((data) => {
        setStoreName(data.store.storeName)
        setStoreDescription(data.store.description || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.store.update({ storeName, description: storeDescription || null })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your account and store settings</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-500">Name</span>
            <span className="text-sm font-medium text-neutral-900">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">Username</span>
            <span className="text-sm font-medium text-neutral-900">@{user?.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">Email</span>
            <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100">
            <span className="text-sm text-neutral-500">Your Page</span>
            <a
              href={`/${user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-neutral-900 hover:underline"
            >
              /{user?.username}
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={saveStore} className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Store</h2>
        <div className="space-y-4">
          <Input
            label="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="My Awesome Store"
            required
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Store Description</label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Tell visitors about your store..."
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-500 placeholder:text-neutral-400 resize-none"
            />
          </div>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          Settings saved!
        </div>
      )}
    </div>
  )
}
