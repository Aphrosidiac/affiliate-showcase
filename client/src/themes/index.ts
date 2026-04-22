export interface ThemeConfig {
  name: string
  description: string
  colors: { bg: string; accent: string; text: string }
  vars: Record<string, string>
}

export const themes: Record<string, ThemeConfig> = {
  luxury: {
    name: 'Luxury',
    description: 'Elegant dark theme with gold accents',
    colors: { bg: '#0a0a0a', accent: '#c9a84c', text: '#f5f5f0' },
    vars: {
      '--theme-bg': '#0a0a0a',
      '--theme-bg-secondary': '#1a1a1a',
      '--theme-surface': '#1f1f1f',
      '--theme-text': '#f5f5f0',
      '--theme-text-secondary': '#a0a0a0',
      '--theme-accent': '#c9a84c',
      '--theme-accent-hover': '#d4b85c',
      '--theme-border': '#2a2a2a',
      '--theme-card-radius': '2px',
      '--theme-card-shadow': '0 2px 12px rgba(0,0,0,0.4)',
      '--theme-font': "'Playfair Display', Georgia, serif",
      '--theme-font-body': "'Inter', sans-serif",
    },
  },
  sporty: {
    name: 'Sporty',
    description: 'Bold and energetic with dynamic feel',
    colors: { bg: '#111111', accent: '#e63946', text: '#ffffff' },
    vars: {
      '--theme-bg': '#111111',
      '--theme-bg-secondary': '#1a1a1a',
      '--theme-surface': '#222222',
      '--theme-text': '#ffffff',
      '--theme-text-secondary': '#b0b0b0',
      '--theme-accent': '#e63946',
      '--theme-accent-hover': '#ff4d5a',
      '--theme-border': '#333333',
      '--theme-card-radius': '8px',
      '--theme-card-shadow': '0 2px 12px rgba(0,0,0,0.3)',
      '--theme-font': "'Oswald', 'Impact', sans-serif",
      '--theme-font-body': "'Inter', sans-serif",
    },
  },
  futuristic: {
    name: 'Futuristic',
    description: 'Neon-lit cyberpunk aesthetic',
    colors: { bg: '#0b0b1a', accent: '#00f0ff', text: '#e0e0ff' },
    vars: {
      '--theme-bg': '#0b0b1a',
      '--theme-bg-secondary': '#12122a',
      '--theme-surface': '#1a1a3e',
      '--theme-text': '#e0e0ff',
      '--theme-text-secondary': '#8888aa',
      '--theme-accent': '#00f0ff',
      '--theme-accent-hover': '#33f5ff',
      '--theme-border': '#2a2a5a',
      '--theme-card-radius': '12px',
      '--theme-card-shadow': '0 2px 16px rgba(0,240,255,0.08)',
      '--theme-font': "'Space Grotesk', monospace",
      '--theme-font-body': "'Space Grotesk', sans-serif",
    },
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple with lots of whitespace',
    colors: { bg: '#ffffff', accent: '#111111', text: '#111111' },
    vars: {
      '--theme-bg': '#fafafa',
      '--theme-bg-secondary': '#f0f0f0',
      '--theme-surface': '#ffffff',
      '--theme-text': '#111111',
      '--theme-text-secondary': '#666666',
      '--theme-accent': '#111111',
      '--theme-accent-hover': '#333333',
      '--theme-border': '#e5e5e5',
      '--theme-card-radius': '12px',
      '--theme-card-shadow': '0 1px 8px rgba(0,0,0,0.06)',
      '--theme-font': "'Inter', -apple-system, sans-serif",
      '--theme-font-body': "'Inter', -apple-system, sans-serif",
    },
  },
  vibrant: {
    name: 'Vibrant',
    description: 'Colorful and playful with warm tones',
    colors: { bg: '#faf7f2', accent: '#ff6b35', text: '#2d2d2d' },
    vars: {
      '--theme-bg': '#faf7f2',
      '--theme-bg-secondary': '#fff5eb',
      '--theme-surface': '#ffffff',
      '--theme-text': '#2d2d2d',
      '--theme-text-secondary': '#6b6b6b',
      '--theme-accent': '#ff6b35',
      '--theme-accent-hover': '#ff8555',
      '--theme-border': '#f0e8df',
      '--theme-card-radius': '16px',
      '--theme-card-shadow': '0 2px 12px rgba(255,107,53,0.08)',
      '--theme-font': "'Poppins', sans-serif",
      '--theme-font-body': "'Poppins', sans-serif",
    },
  },
}

export const themeKeys = Object.keys(themes)

export const platformIcons: Record<string, string> = {
  shopee: 'S',
  tiktok: 'T',
  lazada: 'L',
  amazon: 'A',
  tokopedia: 'Tk',
  other: '',
}

export const platformColors: Record<string, string> = {
  shopee: '#EE4D2D',
  tiktok: '#010101',
  lazada: '#0F146D',
  amazon: '#FF9900',
  tokopedia: '#42B549',
  other: '#888888',
}
