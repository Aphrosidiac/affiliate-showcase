import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth.js'
import { productRoutes } from './routes/products.js'
import { storeRoutes } from './routes/store.js'
import { userRoutes } from './routes/users.js'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))

app.route('/api/auth', authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/store', storeRoutes)
app.route('/api/u', userRoutes)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT) || 3001
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
