import { Hono } from 'hono'
import { writeFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { authMiddleware } from '../middleware/auth.js'

export const uploadRoutes = new Hono()

uploadRoutes.use('*', authMiddleware)

const UPLOAD_DIR = path.resolve(process.cwd(), '..', 'uploads')
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

uploadRoutes.post('/', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided' }, 400)
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json({ error: 'Invalid file type. Allowed: jpg, png, webp, gif' }, 400)
  }

  if (file.size > MAX_SIZE) {
    return c.json({ error: 'File too large. Max 5MB' }, 400)
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${randomUUID()}.${ext}`

  await mkdir(UPLOAD_DIR, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)

  return c.json({ url: `/uploads/${filename}` })
})
