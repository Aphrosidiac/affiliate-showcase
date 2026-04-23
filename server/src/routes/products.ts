import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/db.js'
import { authMiddleware, type AuthUser } from '../middleware/auth.js'

export const productRoutes = new Hono()

productRoutes.use('*', authMiddleware)

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional().nullable(),
  affiliateLink: z.string().url(),
  platform: z.string().default('other'),
  images: z.array(z.string()),
  category: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  displayOrder: z.number().default(0),
})

function parseProduct(p: any) {
  return { ...p, images: JSON.parse(p.images) }
}

productRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser
  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return c.json({ products: products.map(parseProduct) })
})

productRoutes.get('/stats', async (c) => {
  const user = c.get('user') as AuthUser
  const products = await prisma.product.findMany({
    where: { userId: user.id },
    select: { id: true },
  })
  const productIds = products.map((p) => p.id)

  const clicks = await prisma.productClick.groupBy({
    by: ['productId'],
    where: { productId: { in: productIds } },
    _count: { id: true },
  })

  const totalClicks = clicks.reduce((sum, c) => sum + c._count.id, 0)
  const clickMap: Record<string, number> = {}
  clicks.forEach((c) => {
    clickMap[c.productId] = c._count.id
  })

  return c.json({ totalClicks, clicksByProduct: clickMap })
})

productRoutes.post('/', async (c) => {
  const user = c.get('user') as AuthUser
  const body = await c.req.json()
  const result = productSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input', details: result.error.flatten() }, 400)
  }

  const product = await prisma.product.create({
    data: {
      ...result.data,
      images: JSON.stringify(result.data.images),
      userId: user.id,
    },
  })
  return c.json({ product: parseProduct(product) }, 201)
})

productRoutes.put('/:id', async (c) => {
  const user = c.get('user') as AuthUser
  const id = c.req.param('id')

  const existing = await prisma.product.findFirst({ where: { id, userId: user.id } })
  if (!existing) {
    return c.json({ error: 'Product not found' }, 404)
  }

  const body = await c.req.json()
  const result = productSchema.partial().safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input', details: result.error.flatten() }, 400)
  }

  const data: any = { ...result.data }
  if (data.images) {
    data.images = JSON.stringify(data.images)
  }

  const product = await prisma.product.update({ where: { id }, data })
  return c.json({ product: parseProduct(product) })
})

const reorderSchema = z.array(z.object({ id: z.string(), displayOrder: z.number() }))

productRoutes.put('/reorder', async (c) => {
  const user = c.get('user') as AuthUser
  const body = await c.req.json()
  const result = reorderSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  await Promise.all(
    result.data.map((item) =>
      prisma.product.updateMany({
        where: { id: item.id, userId: user.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  )
  return c.json({ success: true })
})

productRoutes.delete('/:id', async (c) => {
  const user = c.get('user') as AuthUser
  const id = c.req.param('id')

  const existing = await prisma.product.findFirst({ where: { id, userId: user.id } })
  if (!existing) {
    return c.json({ error: 'Product not found' }, 404)
  }

  await prisma.product.delete({ where: { id } })
  return c.json({ success: true })
})
