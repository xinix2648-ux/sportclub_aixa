import { useNavigate, useLocation } from 'react-router-dom'
import { getUser } from '../services/authService'
import { FaTachometerAlt, FaUsers, FaUserGraduate } from 'react-icons/fa'

const roleLinks = {
  Admin: { path: '/dashboard/admin', label: 'Panel de Control', icon: <FaTachometerAlt /> },
  Coach: { path: '/dashboard/coach', label: 'Mis Alumnos', icon: <FaUserGraduate /> },
  User: { path: '/dashboard/usuario', label: 'Mi Perfil', icon: <FaUsers /> },
}

const roleColors = { User: 'var(--user-color)', Coach: 'var(--coach-color)', Admin: 'var(--admin-color)' }

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  if (!user) return null

  const link = roleLinks[user.role]
  const accent = roleColors[user.role]

  return (
    <div className="sidebar-glass" style={{
      width: 220, height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1020, paddingTop: '80px'
    }}>
      <div className="px-3 py-3">
        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-4" style={{
          background: `${accent}15`,
          borderLeft: `3px solid ${accent}`,
        }}>
          <span style={{ color: accent, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {link.label}
          </span>
        </div>
        <div
          onClick={() => navigate(link.path)}
          className="d-flex align-items-center gap-3 px-3 py-2 rounded-3"
          style={{
            cursor: 'pointer',
            background: location.pathname === link.path ? `${accent}20` : 'transparent',
            color: location.pathname === link.path ? accent : 'var(--text-muted)',
            borderLeft: location.pathname === link.path ? `3px solid ${accent}` : '3px solid transparent',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { if (location.pathname !== link.path) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
          onMouseLeave={(e) => { if (location.pathname !== link.path) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
        >
          <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{link.label}</span>
        </div>
      </div>
    </div>
  )
}
