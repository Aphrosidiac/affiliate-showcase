import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'affi-showcase-secret-change-in-production'

export interface AuthUser {
  id: string
  email: string
  username: string
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    c.set('user', decoded)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export const signToken = (user: AuthUser): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}
