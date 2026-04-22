import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, type Product } from '../lib/api'
import Button from '../components/ui/Button'
import { Plus, Package, Pencil, Trash2, ExternalLink } from 'lucide-react'

export default function DashboardProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    api.products.list()
      .then((data) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleActive = async (product: Product) => {
    try {
      await api.products.update(product.id, { active: !product.active })
      setProducts(products.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)))
    } catch {}
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await api.products.delete(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch {}
    setDeleting(null)
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/dashboard/products/new">
          <Button className="gap-2"><Plus size={16} /> Add Product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <Package size={48} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-900 font-medium mb-2">No products yet</p>
          <p className="text-neutral-500 text-sm mb-6">Add your first affiliate product to get started</p>
          <Link to="/dashboard/products/new">
            <Button>Add Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <Package size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    RM {product.price.toFixed(2)}
                    {product.originalPrice && (
                      <span className="line-through ml-1.5 text-xs">RM {product.originalPrice.toFixed(2)}</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => toggleActive(product)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex-shrink-0 ${
                    product.active
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  {product.active ? 'Active' : 'Draft'}
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 capitalize">
                    {product.platform}
                  </span>
                  {product.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Featured</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Link
                    to={`/dashboard/products/${product.id}/edit`}
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={deleting === product.id}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
