import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { authRoutes } from './routes/auth.js'
import { productRoutes } from './routes/products.js'
import { storeRoutes } from './routes/store.js'
import { userRoutes } from './routes/users.js'
import { uploadRoutes } from './routes/upload.js'

const app = new Hono()

app.use('*', cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))

app.route('/api/auth', authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/store', storeRoutes)
app.route('/api/u', userRoutes)
app.route('/api/upload', uploadRoutes)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const UPLOAD_DIR = path.resolve(process.cwd(), '..', 'uploads')

app.get('/uploads/:filename', async (c) => {
  const filename = c.req.param('filename')
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return c.notFound()
  }
  try {
    const data = await readFile(path.join(UPLOAD_DIR, filename))
    const ext = path.extname(filename).slice(1).toLowerCase()
    const types: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', gif: 'image/gif',
    }
    return new Response(data, {
      headers: {
        'Content-Type': types[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return c.notFound()
  }
})

const port = Number(process.env.PORT) || 3001
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
