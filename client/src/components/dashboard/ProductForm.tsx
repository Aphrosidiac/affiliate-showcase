import { useState, useEffect, useRef } from 'react'
import { type Product, api } from '../../lib/api'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Upload, X, ImageOff, Loader2 } from 'lucide-react'

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
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [featured, setFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setPrice(product.price.toString())
      setOriginalPrice(product.originalPrice?.toString() || '')
      setAffiliateLink(product.affiliateLink)
      setPlatform(product.platform)
      setImages(product.images || [])
      setCategory(product.category || '')
      setFeatured(product.featured)
    }
  }, [product])

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError('')

    for (const file of Array.from(files)) {
      try {
        const url = await api.upload(file)
        setImages((prev) => [...prev, url])
      } catch (err: any) {
        setUploadError(err.message || 'Upload failed')
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
      images,
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

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Images</label>
        {uploadError && (
          <p className="text-sm text-red-600 mb-2">{uploadError}</p>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                  ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center">
                <ImageOff size={20} className="text-neutral-300" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
            {uploading ? (
              <Loader2 size={22} className="text-neutral-400 animate-spin" />
            ) : (
              <>
                <Upload size={22} className="text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-500">Upload</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-xs text-neutral-400 mt-1.5">JPG, PNG, WebP, or GIF. Max 5MB each.</p>
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
        <Button type="submit" loading={loading} disabled={uploading}>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}
