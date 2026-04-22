import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { themes, themeKeys } from '../themes'
import { Check } from 'lucide-react'

export default function DashboardTheme() {
  const [currentTheme, setCurrentTheme] = useState('minimal')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.store.get()
      .then((data) => setCurrentTheme(data.store.theme))
      .catch(() => {})
  }, [])

  const saveTheme = async (theme: string) => {
    setCurrentTheme(theme)
    setSaving(true)
    setSaved(false)
    try {
      await api.store.update({ theme })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Store Theme</h1>
        <p className="text-neutral-500 text-sm mt-1">Choose how your showcase page looks to visitors</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themeKeys.map((key) => {
          const theme = themes[key]
          const isActive = currentTheme === key

          return (
            <button
              key={key}
              onClick={() => saveTheme(key)}
              disabled={saving}
              className={`relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                isActive ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div
                className="aspect-[4/3] p-4 flex flex-col justify-between"
                style={{ backgroundColor: theme.colors.bg }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                  <div className="h-2 w-20 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.3 }} />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="overflow-hidden"
                      style={{
                        backgroundColor: theme.vars['--theme-surface'],
                        borderRadius: theme.vars['--theme-card-radius'],
                      }}
                    >
                      <div className="aspect-square" style={{ backgroundColor: theme.vars['--theme-bg-secondary'] }} />
                      <div className="p-1.5">
                        <div className="h-1.5 w-full rounded-full mb-1" style={{ backgroundColor: theme.colors.text, opacity: 0.2 }} />
                        <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{theme.name}</p>
                    <p className="text-xs text-neutral-500">{theme.description}</p>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          Theme updated!
        </div>
      )}
    </div>
  )
}
