import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type PublicUser, type Product } from '../lib/api'
import ThemedLayout from '../components/showcase/ThemedLayout'
import ProductCard from '../components/showcase/ProductCard'
import { Package } from 'lucide-react'

export default function Showcase() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

              {user.store?.description && (
                <p
                  className="text-sm max-w-sm mx-auto leading-relaxed"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {user.store.description}
                </p>
              )}

              {/* Product count */}
              {products.length > 0 && (
                <p
                  className="text-xs mt-4 font-medium tracking-wide uppercase"
                  style={{ color: 'var(--theme-text-secondary)', opacity: 0.6 }}
                >
                  {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </header>

          {/* Divider */}
          <div
            className="max-w-6xl mx-auto px-4 mb-8"
          >
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

        {/* Footer — always at bottom */}
        <footer className="py-6 text-center">
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)', opacity: 0.35 }}>
            Powered by AffiShowcase
          </p>
        </footer>
      </div>
    </ThemedLayout>
  )
}
