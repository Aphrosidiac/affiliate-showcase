import { Hono } from 'hono'
import { prisma } from '../lib/db.js'

export const userRoutes = new Hono()

userRoutes.get('/:username', async (c) => {
  const username = c.req.param('username')
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      store: {
        select: {
          storeName: true,
          description: true,
          theme: true,
          socialLinks: true,
        },
      },
    },
  })
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json({ user })
})

userRoutes.get('/:username/products', async (c) => {
  const username = c.req.param('username')
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const products = await prisma.product.findMany({
    where: { userId: user.id, active: true },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return c.json({
    products: products.map((p) => ({ ...p, images: JSON.parse(p.images) })),
  })
})

userRoutes.get('/:username/product/:id', async (c) => {
  const username = c.req.param('username')
  const id = c.req.param('id')

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const product = await prisma.product.findFirst({
    where: { id, userId: user.id, active: true },
  })
  if (!product) {
    return c.json({ error: 'Product not found' }, 404)
  }
  return c.json({ product: { ...product, images: JSON.parse(product.images) } })
})
