import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageOff, ArrowRight } from 'lucide-react'
import { type Product } from '../../lib/api'
import { platformColors } from '../../themes'

interface ProductCardProps {
  product: Product
  username: string
}

const platformLabels: Record<string, string> = {
  shopee: 'Shopee',
  tiktok: 'TikTok',
  lazada: 'Lazada',
  amazon: 'Amazon',
  tokopedia: 'Tokopedia',
  other: '',
}

export default function ProductCard({ product, username }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null
  const platformLabel = platformLabels[product.platform]
  const platformColor = platformColors[product.platform] || '#888'

  return (
    <Link
      to={`/${username}/product/${product.id}`}
      className="group block"
    >
      <div
        className="overflow-hidden border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{
          borderColor: 'var(--theme-border)',
          backgroundColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-card-radius)',
          boxShadow: 'var(--theme-card-shadow)',
        }}
      >
        {/* Image — 4:5 aspect ratio */}
        <div className="aspect-[4/5] overflow-hidden relative">
          {product.images[0] && !imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: 'var(--theme-bg-secondary)' }}
            >
              <ImageOff size={28} style={{ color: 'var(--theme-text-secondary)', opacity: 0.25 }} />
            </div>
          )}

          {/* Badges */}
          {discount && discount > 0 && (
            <span
              className="absolute top-2.5 right-2.5 px-2 py-0.5 text-xs font-bold rounded-full text-white"
              style={{ backgroundColor: 'var(--theme-accent)' }}
            >
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span
              className="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-medium rounded-full"
              style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-bg)' }}
            >
              Featured
            </span>
          )}

          {/* Platform badge */}
          {platformLabel && (
            <span
              className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[10px] font-semibold rounded-full text-white"
              style={{ backgroundColor: platformColor }}
            >
              {platformLabel}
            </span>
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
          >
            <span
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              View Details <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3
            className="text-sm font-semibold truncate mb-1.5"
            style={{ fontFamily: 'var(--theme-font)', color: 'var(--theme-text)' }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: 'var(--theme-accent)' }}>
              RM {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span
                className="text-xs line-through"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                RM {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
