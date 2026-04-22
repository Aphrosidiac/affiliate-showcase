import { type ReactNode } from 'react'
import { themes } from '../../themes'

interface ThemedLayoutProps {
  theme: string
  children: ReactNode
}

export default function ThemedLayout({ theme, children }: ThemedLayoutProps) {
  const themeConfig = themes[theme] || themes.minimal

  return (
    <div
      style={{
        ...themeConfig.vars,
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text)',
        fontFamily: 'var(--theme-font-body)',
      } as React.CSSProperties}
      className="min-h-screen"
    >
      {children}
    </div>
  )
}
