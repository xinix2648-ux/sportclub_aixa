import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Recover from './pages/Recover'
import DashboardUsuario from './pages/DashboardUsuario'
import DashboardCoach from './pages/DashboardCoach'
import DashboardAdmin from './pages/DashboardAdmin'
import EditProfile from './pages/EditProfile'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import { getToken, getUser } from './services/authService'

function RedirectHome() {
  if (!getToken()) return <Landing />
  const user = getUser()
  const map = { user: '/dashboard/user', coach: '/dashboard/coach', admin: '/dashboard/admin' }
  return <Navigate to={map[user?.role] || '/'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/dashboard/user" element={<RoleRoute role="user"><DashboardUsuario /></RoleRoute>} />
      <Route path="/dashboard/coach" element={<RoleRoute role="coach"><DashboardCoach /></RoleRoute>} />
      <Route path="/dashboard/admin" element={<RoleRoute role="admin"><DashboardAdmin /></RoleRoute>} />
      <Route path="/dashboard/perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="*" element={<RedirectHome />} />
    </Routes>
  )
}
