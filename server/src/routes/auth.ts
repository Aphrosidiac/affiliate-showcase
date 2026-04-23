import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/db.js'
import { signToken, authMiddleware, type AuthUser } from '../middleware/auth.js'

export const authRoutes = new Hono()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

authRoutes.post('/register', async (c) => {
  const body = await c.req.json()
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input', details: result.error.flatten() }, 400)
  }

  const { email, password, name, username } = result.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username: username.toLowerCase() }] },
  })
  if (existing) {
    return c.json({ error: 'Email or username already taken' }, 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username: username.toLowerCase(),
    },
  })

  await prisma.store.create({
    data: {
      userId: user.id,
      storeName: `${name}'s Store`,
    },
  })

  const token = signToken({ id: user.id, email: user.email, username: user.username })
  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, username: user.username },
  })
})

authRoutes.post('/login', async (c) => {
  const body = await c.req.json()
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const { email, password } = result.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const token = signToken({ id: user.id, email: user.email, username: user.username })
  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, username: user.username },
  })
})

authRoutes.get('/me', authMiddleware, async (c) => {
  const authUser = c.get('user') as AuthUser
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, email: true, name: true, username: true, bio: true, avatar: true },
  })
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json({ user })
})

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
})

authRoutes.put('/profile', authMiddleware, async (c) => {
  const authUser = c.get('user') as AuthUser
  const body = await c.req.json()
  const result = profileSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const user = await prisma.user.update({
    where: { id: authUser.id },
    data: result.data,
    select: { id: true, email: true, name: true, username: true, bio: true, avatar: true },
  })
  return c.json({ user })
})

const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
})

authRoutes.put('/password', authMiddleware, async (c) => {
  const authUser = c.get('user') as AuthUser
  const body = await c.req.json()
  const result = passwordSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const valid = await bcrypt.compare(result.data.currentPassword, user.password)
  if (!valid) {
    return c.json({ error: 'Current password is incorrect' }, 400)
  }

  const hashedPassword = await bcrypt.hash(result.data.newPassword, 10)
  await prisma.user.update({ where: { id: authUser.id }, data: { password: hashedPassword } })
  return c.json({ success: true })
})
