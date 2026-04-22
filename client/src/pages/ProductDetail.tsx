import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, type PublicUser, type Product } from '../lib/api'
import ThemedLayout from '../components/showcase/ThemedLayout'
import ImageCarousel from '../components/showcase/ImageCarousel'
import { ArrowLeft, ExternalLink, ShoppingBag } from 'lucide-react'

const platformLabels: Record<string, string> = {
  shopee: 'Shopee',
  tiktok: 'TikTok Shop',
  lazada: 'Lazada',
  amazon: 'Amazon',
  tokopedia: 'Tokopedia',
  other: 'Store',
}

export default function ProductDetail() {
  const { username, id } = useParams<{ username: string; id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!username || !id) return
    Promise.all([api.public.getUser(username), api.public.getProduct(username, id)])
      .then(([userData, productData]) => {
        setUser(userData.user)
        setProduct(productData.product)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [username, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !user || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-4xl font-bold text-neutral-300 mb-2">404</p>
          <p className="text-neutral-500 mb-4">Product not found</p>
          <Link to={`/${username}`} className="text-sm text-neutral-900 font-medium hover:underline">Back to store</Link>
        </div>
      </div>
    )
  }

  const theme = user.store?.theme || 'minimal'
  const platformLabel = platformLabels[product.platform] || 'Store'
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <ThemedLayout theme={theme}>
      <div className="max-w-2xl mx-auto">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate(`/${username}`)}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <ImageCarousel images={product.images} alt={product.name} />

        <div className="px-4 py-6 space-y-4">
          {product.category && (
            <span
              className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
              style={{ backgroundColor: 'var(--theme-bg-secondary)', color: 'var(--theme-text-secondary)' }}
            >
              {product.category}
            </span>
          )}

          <h1 className="text-xl md:text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--theme-font)' }}>
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold" style={{ color: 'var(--theme-accent)' }}>
              RM {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base line-through" style={{ color: 'var(--theme-text-secondary)' }}>
                  RM {product.originalPrice.toFixed(2)}
                </span>
                <span
                  className="text-sm font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-bg)' }}
                >
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ShoppingBag size={14} style={{ color: 'var(--theme-text-secondary)' }} />
            <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
              Available on {platformLabel}
            </span>
          </div>

          {product.description && (
            <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--theme-border)' }}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text-secondary)' }}>
                Description
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--theme-text)' }}>
                {product.description}
              </p>
            </div>
          )}

          <div className="pt-4 pb-8">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 px-6 text-base font-semibold transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--theme-accent)',
                color: 'var(--theme-bg)',
                borderRadius: 'var(--theme-card-radius)',
              }}
            >
              <ExternalLink size={18} />
              Shop on {platformLabel}
            </a>
          </div>
        </div>

        <footer className="text-center pb-8">
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)', opacity: 0.5 }}>
            Powered by AffiShowcase
          </p>
        </footer>
      </div>
    </ThemedLayout>
  )
}
