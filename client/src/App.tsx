import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DashboardProducts from './pages/DashboardProducts'
import DashboardProductForm from './pages/DashboardProductForm'
import DashboardTheme from './pages/DashboardTheme'
import DashboardSettings from './pages/DashboardSettings'
import Showcase from './pages/Showcase'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route path="products/new" element={<DashboardProductForm />} />
            <Route path="products/:id/edit" element={<DashboardProductForm />} />
            <Route path="theme" element={<DashboardTheme />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          <Route path="/:username" element={<Showcase />} />
          <Route path="/:username/product/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
