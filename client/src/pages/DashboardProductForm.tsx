import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, type Product } from '../lib/api'
import ProductForm from '../components/dashboard/ProductForm'
import { ArrowLeft } from 'lucide-react'

export default function DashboardProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      api.products.list()
        .then((data) => {
          const found = data.products.find((p) => p.id === id)
          setProduct(found || null)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (data: Partial<Product>) => {
    setSaving(true)
    try {
      if (id) {
        await api.products.update(id, data)
      } else {
        await api.products.create(data)
      }
      navigate('/dashboard/products')
    } catch {
      alert('Failed to save product')
    } finally {
      setSaving(false)
    }
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        {id ? 'Edit Product' : 'Add Product'}
      </h1>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <ProductForm product={product} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  )
}
