import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/db.js'
import { authMiddleware, type AuthUser } from '../middleware/auth.js'

export const storeRoutes = new Hono()

storeRoutes.use('*', authMiddleware)

const storeSchema = z.object({
  storeName: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  theme: z.string().optional(),
  socialLinks: z.string().optional().nullable(),
})

storeRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser
  const store = await prisma.store.findUnique({ where: { userId: user.id } })
  if (!store) {
    return c.json({ error: 'Store not found' }, 404)
  }
  return c.json({ store })
})

storeRoutes.put('/', async (c) => {
  const user = c.get('user') as AuthUser
  const body = await c.req.json()
  const result = storeSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const store = await prisma.store.upsert({
    where: { userId: user.id },
    update: result.data,
    create: {
      userId: user.id,
      storeName: result.data.storeName || 'My Store',
      ...result.data,
    },
  })
  return c.json({ store })
})
