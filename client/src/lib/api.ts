const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface User {
  id: string
  email: string
  name: string
  username: string
  bio?: string
  avatar?: string
}

export interface Store {
  id?: string
  storeName: string
  description?: string | null
  theme: string
  socialLinks?: string | null
}

export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  originalPrice?: number | null
  affiliateLink: string
  platform: string
  images: string[]
  category?: string | null
  featured: boolean
  active: boolean
  displayOrder: number
  createdAt: string
}

export interface PublicUser {
  id: string
  name: string
  username: string
  bio?: string
  avatar?: string
  store: Store | null
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) throw new ApiError(res.status, data.error || 'Something went wrong')
  return data
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string; username: string }) =>
      request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<{ user: User }>('/auth/me'),
  },
  products: {
    list: () => request<{ products: Product[] }>('/products'),
    create: (data: Partial<Product>) =>
      request<{ product: Product }>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Product>) =>
      request<{ product: Product }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  store: {
    get: () => request<{ store: Store }>('/store'),
    update: (data: Partial<Store>) =>
      request<{ store: Store }>('/store', { method: 'PUT', body: JSON.stringify(data) }),
  },
  public: {
    getUser: (username: string) => request<{ user: PublicUser }>(`/u/${username}`),
    getProducts: (username: string) => request<{ products: Product[] }>(`/u/${username}/products`),
    getProduct: (username: string, id: string) => request<{ product: Product }>(`/u/${username}/product/${id}`),
  },
}
