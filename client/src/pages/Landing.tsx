import { Link } from 'react-router-dom'
import { ArrowRight, Palette, ShoppingBag, Smartphone, Zap } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  { icon: Palette, title: 'Stunning Themes', desc: 'Choose from luxury, sporty, futuristic, and more' },
  { icon: ShoppingBag, title: 'Product Showcase', desc: 'Beautiful product pages with image carousels' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Looks perfect on every device, designed for phones' },
  { icon: Zap, title: 'Instant Setup', desc: 'Sign up, add products, share your link. That simple' },
]

const themePreview = [
  { name: 'Luxury', bg: '#0a0a0a', accent: '#c9a84c', text: '#f5f5f0' },
  { name: 'Sporty', bg: '#111111', accent: '#e63946', text: '#ffffff' },
  { name: 'Futuristic', bg: '#0b0b1a', accent: '#00f0ff', text: '#e0e0ff' },
  { name: 'Minimal', bg: '#ffffff', accent: '#111111', text: '#111111' },
  { name: 'Vibrant', bg: '#faf7f2', accent: '#ff6b35', text: '#2d2d2d' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-neutral-900">AffiShowcase</h1>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight mb-6">
          Your affiliate products,<br />
          <span className="text-neutral-400">your brand.</span>
        </h2>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
          Create a stunning showcase page for your affiliate products. Choose a theme, add your products, and share your personalized link.
        </p>
        <Link to="/register">
          <Button size="lg" className="gap-2">
            Start for free <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
              <Icon size={24} className="text-neutral-900 mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
              <p className="text-sm text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-neutral-900 text-center mb-8">Themes that match your brand</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themePreview.map((t) => (
            <div
              key={t.name}
              className="aspect-[3/4] rounded-xl p-4 flex flex-col justify-end border"
              style={{ backgroundColor: t.bg, borderColor: t.accent + '33' }}
            >
              <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: t.accent }} />
              <p className="text-sm font-medium" style={{ color: t.text }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">Ready to showcase your products?</h3>
        <p className="text-neutral-500 mb-8">Get your personalized affiliate showcase page in minutes.</p>
        <Link to="/register">
          <Button size="lg" className="gap-2">
            Create your page <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-neutral-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-neutral-400">
          AffiShowcase — Showcase your affiliate products beautifully
        </div>
      </footer>
    </div>
  )
}
