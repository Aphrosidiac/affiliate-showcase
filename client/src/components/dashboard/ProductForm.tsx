import { useState, useEffect } from 'react'
import { type Product } from '../../lib/api'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Plus, X, GripVertical } from 'lucide-react'

interface ProductFormProps {
  product?: Product | null
  onSubmit: (data: Partial<Product>) => Promise<void>
  loading?: boolean
}

const platforms = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'tiktok', label: 'TikTok Shop' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'tokopedia', label: 'Tokopedia' },
  { value: 'other', label: 'Other' },
]

export default function ProductForm({ product, onSubmit, loading }: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')
  const [platform, setPlatform] = useState('shopee')
  const [images, setImages] = useState<string[]>([''])
  const [category, setCategory] = useState('')
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setPrice(product.price.toString())
      setOriginalPrice(product.originalPrice?.toString() || '')
      setAffiliateLink(product.affiliateLink)
      setPlatform(product.platform)
      setImages(product.images.length > 0 ? product.images : [''])
      setCategory(product.category || '')
      setFeatured(product.featured)
    }
  }, [product])

  const addImage = () => setImages([...images, ''])
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index))
  const updateImage = (index: number, value: string) => {
    const updated = [...images]
    updated[index] = value
    setImages(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name,
      description: description || undefined,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      affiliateLink,
      platform,
      images: images.filter(Boolean),
      category: category || null,
      featured,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Premium Wireless Headphones"
          required
        />
        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Electronics, Fashion"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the product..."
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-500 placeholder:text-neutral-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price (RM)"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
        />
        <Input
          label="Original Price (optional, for discount)"
          type="number"
          step="0.01"
          min="0"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Affiliate Link"
          type="url"
          value={affiliateLink}
          onChange={(e) => setAffiliateLink(e.target.value)}
          placeholder="https://..."
          required
        />
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-500 bg-white"
          >
            {platforms.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Images (URLs)</label>
        <div className="space-y-2">
          {images.map((img, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex items-center text-neutral-300">
                <GripVertical size={16} />
              </div>
              <input
                type="url"
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-500 placeholder:text-neutral-400"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <Plus size={16} /> Add image
        </button>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
        />
        <span className="text-sm font-medium text-neutral-700">Featured product</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}
