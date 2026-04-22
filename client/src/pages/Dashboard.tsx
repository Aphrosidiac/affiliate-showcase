import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api, type Product, type Store } from '../lib/api'
import { Package, Plus, Palette, Eye } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.products.list(), api.store.get()])
      .then(([prodData, storeData]) => {
        setProducts(prodData.products)
        setStore(storeData.store)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {user?.name}</h1>
        <p className="text-neutral-500 mt-1">Here's an overview of your showcase</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, icon: Package },
          { label: 'Active', value: products.filter((p) => p.active).length, icon: Eye },
          { label: 'Featured', value: products.filter((p) => p.featured).length, icon: Package },
          { label: 'Theme', value: store?.theme || 'minimal', icon: Palette },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-4 rounded-xl border border-neutral-200">
            <Icon size={18} className="text-neutral-400 mb-2" />
            <p className="text-2xl font-bold text-neutral-900 capitalize">{value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/dashboard/products/new">
          <Button className="gap-2"><Plus size={16} /> Add Product</Button>
        </Link>
        <Link to="/dashboard/theme">
          <Button variant="outline" className="gap-2"><Palette size={16} /> Change Theme</Button>
        </Link>
        <a href={`/${user?.username}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="gap-2"><Eye size={16} /> View Page</Button>
        </a>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Products</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <Package size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-4">No products yet. Add your first affiliate product!</p>
            <Link to="/dashboard/products/new">
              <Button size="sm">Add Product</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
            {products.slice(0, 5).map((product) => (
              <Link
                key={product.id}
                to={`/dashboard/products/${product.id}/edit`}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <Package size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                  <p className="text-xs text-neutral-500">RM {product.price.toFixed(2)} · {product.platform}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  product.active ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {product.active ? 'Active' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
