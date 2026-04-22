import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type PublicUser, type Product } from '../lib/api'
import ThemedLayout from '../components/showcase/ThemedLayout'
import ProductCard from '../components/showcase/ProductCard'

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

  return (
    <ThemedLayout theme={theme}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          )}
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--theme-font)' }}
          >
            {user.store?.storeName || user.name}
          </h1>
          {user.store?.description && (
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--theme-text-secondary)' }}>
              {user.store.description}
            </p>
          )}
        </header>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: 'var(--theme-text-secondary)' }}>No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} username={username!} />
            ))}
          </div>
        )}

        <footer className="mt-16 text-center pb-8">
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)', opacity: 0.5 }}>
            Powered by AffiShowcase
          </p>
        </footer>
      </div>
    </ThemedLayout>
  )
}
