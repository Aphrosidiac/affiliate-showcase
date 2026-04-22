import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { type Product } from '../../lib/api'

interface ProductCardProps {
  product: Product
  username: string
}

export default function ProductCard({ product, username }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link
      to={`/${username}/product/${product.id}`}
      className="group block overflow-hidden"
    >
      <div
        className="overflow-hidden border transition-all duration-300 group-hover:shadow-lg"
        style={{
          borderColor: 'var(--theme-border)',
          backgroundColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-card-radius)',
        }}
      >
        <div className="aspect-square overflow-hidden relative">
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
              <ImageOff size={24} style={{ color: 'var(--theme-text-secondary)', opacity: 0.4 }} />
              <span style={{ color: 'var(--theme-text-secondary)', opacity: 0.4 }} className="text-xs">
                No image
              </span>
            </div>
          )}
          {discount && discount > 0 && (
            <span
              className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded-full text-white"
              style={{ backgroundColor: 'var(--theme-accent)' }}
            >
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full"
              style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-bg)' }}
            >
              Featured
            </span>
          )}
        </div>

        <div className="p-3">
          <h3
            className="text-sm font-medium truncate mb-1"
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
