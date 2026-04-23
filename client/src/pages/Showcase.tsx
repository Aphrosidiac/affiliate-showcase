import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type PublicUser, type Product } from '../lib/api'
import ThemedLayout from '../components/showcase/ThemedLayout'
import ProductCard from '../components/showcase/ProductCard'
import { Package, Share2, Check, Globe } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

interface SocialLinks {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
  facebook?: string
  website?: string
}

function SocialIcon({ type, size = 16 }: { type: string; size?: number }) {
  if (type === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
  if (type === 'tiktok') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.86a8.28 8.28 0 004.76 1.5V6.88a4.84 4.84 0 01-1-.19z"/>
    </svg>
  )
  if (type === 'youtube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17"/><path d="m10 15 5-3-5-3z"/>
    </svg>
  )
  if (type === 'twitter') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
  if (type === 'facebook') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
  return <Globe size={size} />
}

export default function Showcase() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!username) return
    Promise.all([api.public.getUser(username), api.public.getProducts(username)])
      .then(([userData, productData]) => {
        setUser(userData.user)
        setProducts(productData.products)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [username])

  const handleShare = async () => {
    const url = window.location.href
    const title = user?.store?.storeName || user?.name || 'Store'
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-4xl font-bold text-neutral-300 mb-2">404</p>
          <p className="text-neutral-500 mb-4">This page doesn't exist</p>
          <Link to="/" className="text-sm text-neutral-900 font-medium hover:underline">Go home</Link>
        </div>
      </div>
    )
  }

  const theme = user.store?.theme || 'minimal'
  const storeName = user.store?.storeName || user.name
  const initials = storeName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  let socials: SocialLinks = {}
  try {
    socials = user.store?.socialLinks ? JSON.parse(user.store.socialLinks) : {}
  } catch {}
  const socialEntries = Object.entries(socials).filter(([, v]) => v) as [string, string][]

  useSEO({
    title: storeName,
    description: user.store?.description || `${storeName} — ${products.length} products`,
    image: user.avatar || undefined,
    url: window.location.href,
  })

  const gridCols =
    products.length === 1
      ? 'grid-cols-1 max-w-xs mx-auto'
      : products.length === 2
        ? 'grid-cols-2 max-w-lg mx-auto'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <ThemedLayout theme={theme}>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <header className="pt-10 pb-8 px-4">
            <div className="max-w-6xl mx-auto text-center">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={storeName}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-2"
                  style={{ ringColor: 'var(--theme-border)' }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: 'var(--theme-bg-secondary)',
                    color: 'var(--theme-accent)',
                    border: '2px solid var(--theme-border)',
                  }}
                >
                  {initials}
                </div>
              )}

              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--theme-font)' }}
              >
                {storeName}
              </h1>

              {user.bio && (
                <p
                  className="text-sm max-w-sm mx-auto leading-relaxed mb-1"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {user.bio}
                </p>
              )}

              {user.store?.description && (
                <p
                  className="text-sm max-w-sm mx-auto leading-relaxed"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {user.store.description}
                </p>
              )}

              {/* Social Links */}
              {socialEntries.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {socialEntries.map(([type, url]) => (
                    <a
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: 'var(--theme-bg-secondary)',
                        color: 'var(--theme-text-secondary)',
                        border: '1px solid var(--theme-border)',
                      }}
                    >
                      <SocialIcon type={type} size={16} />
                    </a>
                  ))}
                </div>
              )}

              {/* Share + Product count */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {products.length > 0 && (
                  <p
                    className="text-xs font-medium tracking-wide uppercase"
                    style={{ color: 'var(--theme-text-secondary)', opacity: 0.6 }}
                  >
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--theme-bg-secondary)',
                    color: 'var(--theme-text-secondary)',
                    border: '1px solid var(--theme-border)',
                  }}
                >
                  {copied ? <Check size={13} /> : <Share2 size={13} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
              </div>
            </div>
          </header>

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div
              className="h-px w-16 mx-auto"
              style={{ backgroundColor: 'var(--theme-accent)', opacity: 0.3 }}
            />
          </div>

          {/* Products */}
          <section className="max-w-6xl mx-auto px-4 pb-12">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={40} style={{ color: 'var(--theme-text-secondary)', opacity: 0.3 }} className="mx-auto mb-3" />
                <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                  No products yet
                </p>
              </div>
            ) : (
              <div className={`grid gap-3 md:gap-5 ${gridCols}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} username={username!} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)', opacity: 0.35 }}>
            Powered by AffiShowcase
          </p>
        </footer>
      </div>
    </ThemedLayout>
  )
}
