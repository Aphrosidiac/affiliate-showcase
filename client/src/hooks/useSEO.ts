import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function useSEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | AffiShowcase`
    }

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (title) setMeta('og:title', title)
    if (description) {
      setNameMeta('description', description)
      setMeta('og:description', description)
    }
    if (image) setMeta('og:image', image)
    if (url) setMeta('og:url', url)
    setMeta('og:type', 'website')

    return () => {
      document.title = 'AffiShowcase'
    }
  }, [title, description, image, url])
}
