import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Camera, Loader2, Eye, EyeOff } from 'lucide-react'

interface SocialLinks {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
  facebook?: string
  website?: string
}

export default function DashboardSettings() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const [savingStore, setSavingStore] = useState(false)
  const [storeSaved, setStoreSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.auth.me(), api.store.get()])
      .then(([userData, storeData]) => {
        setBio(userData.user.bio || '')
        setAvatar(userData.user.avatar || null)
        setStoreName(storeData.store.storeName)
        setStoreDescription(storeData.store.description || '')
        try {
          setSocialLinks(storeData.store.socialLinks ? JSON.parse(storeData.store.socialLinks) : {})
        } catch {
          setSocialLinks({})
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const url = await api.upload(file)
      setAvatar(url)
      await api.auth.updateProfile({ avatar: url })
    } catch {}
    setUploadingAvatar(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileSaved(false)
    try {
      await api.auth.updateProfile({ bio: bio || null })
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch {}
    setSavingProfile(false)
  }

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingStore(true)
    setStoreSaved(false)
    try {
      const cleaned: SocialLinks = {}
      if (socialLinks.instagram) cleaned.instagram = socialLinks.instagram
      if (socialLinks.tiktok) cleaned.tiktok = socialLinks.tiktok
      if (socialLinks.youtube) cleaned.youtube = socialLinks.youtube
      if (socialLinks.twitter) cleaned.twitter = socialLinks.twitter
      if (socialLinks.facebook) cleaned.facebook = socialLinks.facebook
      if (socialLinks.website) cleaned.website = socialLinks.website

      await api.store.update({
        storeName,
        description: storeDescription || null,
        socialLinks: Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : null,
      })
      setStoreSaved(true)
      setTimeout(() => setStoreSaved(false), 2000)
    } catch {}
    setSavingStore(false)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setSavingPassword(true)
    setPasswordSaved(false)
    try {
      await api.auth.changePassword({ currentPassword, newPassword })
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password')
    }
    setSavingPassword(false)
  }

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }))
  }

  const initials = (user?.name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your account and store settings</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account</h2>
        <div className="flex items-start gap-6 mb-6">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center text-xl font-bold text-neutral-500">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              {uploadingAvatar ? (
                <Loader2 size={20} className="text-white animate-spin" />
              ) : (
                <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-neutral-500">Name</span>
              <span className="text-sm font-medium text-neutral-900">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-neutral-100">
              <span className="text-sm text-neutral-500">Username</span>
              <span className="text-sm font-medium text-neutral-900">@{user?.username}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-neutral-100">
              <span className="text-sm text-neutral-500">Email</span>
              <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-neutral-100">
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
      </div>

      {/* Bio */}
      <form onSubmit={saveProfile} className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors about yourself..."
              rows={3}
              maxLength={300}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-500 placeholder:text-neutral-400 resize-none"
            />
            <p className="text-xs text-neutral-400 mt-1">{bio.length}/300</p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" loading={savingProfile}>Save Profile</Button>
            {profileSaved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </div>
      </form>

      {/* Store Settings */}
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Social Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Instagram"
                value={socialLinks.instagram || ''}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
              />
              <Input
                label="TikTok"
                value={socialLinks.tiktok || ''}
                onChange={(e) => updateSocial('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@username"
              />
              <Input
                label="YouTube"
                value={socialLinks.youtube || ''}
                onChange={(e) => updateSocial('youtube', e.target.value)}
                placeholder="https://youtube.com/@channel"
              />
              <Input
                label="Twitter / X"
                value={socialLinks.twitter || ''}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                placeholder="https://x.com/username"
              />
              <Input
                label="Facebook"
                value={socialLinks.facebook || ''}
                onChange={(e) => updateSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/page"
              />
              <Input
                label="Website"
                value={socialLinks.website || ''}
                onChange={(e) => updateSocial('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={savingStore}>Save Store</Button>
            {storeSaved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={changePassword} className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Change Password</h2>
        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {passwordError}
          </div>
        )}
        <div className="space-y-4 max-w-md">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="flex items-center gap-3">
            <Button type="submit" loading={savingPassword}>Change Password</Button>
            {passwordSaved && <span className="text-sm text-green-600">Password changed</span>}
          </div>
        </div>
      </form>
    </div>
  )
}
