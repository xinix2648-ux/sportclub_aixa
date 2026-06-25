import { Navigate } from 'react-router-dom'
import { getToken, getUser } from '../services/authService'

const dashboardMap = {
  user: '/dashboard/user',
  coach: '/dashboard/coach',
  admin: '/dashboard/admin'
}

export default function RoleRoute({ children, role }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  const user = getUser()
  if (!user || user.role !== role) {
    const fallback = dashboardMap[user?.role] || '/login'
    return <Navigate to={fallback} replace />
  }
  return children
}
