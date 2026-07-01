import { useNavigate, useLocation } from 'react-router-dom'
import { getUser, logout } from '../services/authService'
import { FaTachometerAlt, FaUsers, FaUserGraduate, FaDumbbell, FaUserCog, FaSignOutAlt } from 'react-icons/fa'

const roleLinks = {
  admin: [
    { path: '/dashboard/admin', label: 'Panel', icon: <FaTachometerAlt /> },
    { path: '/dashboard/deportes', label: 'Deportes', icon: <FaDumbbell /> },
    { path: '/dashboard/perfil', label: 'Perfil', icon: <FaUserCog /> },
  ],
  coach: [
    { path: '/dashboard/coach', label: 'Panel', icon: <FaUserGraduate /> },
    { path: '/dashboard/perfil', label: 'Perfil', icon: <FaUserCog /> },
  ],
  user: [
    { path: '/dashboard/user', label: 'Panel', icon: <FaUsers /> },
    { path: '/dashboard/perfil', label: 'Perfil', icon: <FaUserCog /> },
  ],
}

const roleColors = { user: 'var(--user-color)', coach: 'var(--coach-color)', admin: 'var(--admin-color)' }
const roleLabels = { user: 'Atleta', coach: 'Entrenador', admin: 'Admin' }

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  if (!user) return null

  const links = roleLinks[user.role] || []
  const accent = roleColors[user.role]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sidebar-glass d-flex flex-column" style={{
      width: 220, height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1020, paddingTop: '80px'
    }}>
      <div className="px-3 py-3 flex-grow-1">
        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-4" style={{
          background: `${accent}10`,
          borderLeft: `3px solid ${accent}`,
        }}>
          <span style={{ color: accent, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {roleLabels[user.role]}
          </span>
        </div>
        {links.map((link) => (
          <div
            key={link.path}
            onClick={() => navigate(link.path)}
            className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1"
            style={{
              cursor: 'pointer',
              background: location.pathname === link.path ? `${accent}12` : 'transparent',
              color: location.pathname === link.path ? accent : 'var(--text-muted)',
              borderLeft: location.pathname === link.path ? `3px solid ${accent}` : '3px solid transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { if (location.pathname !== link.path) { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
            onMouseLeave={(e) => { if (location.pathname !== link.path) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{link.label}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <div
          onClick={handleLogout}
          className="d-flex align-items-center gap-3 px-3 py-2 rounded-3"
          style={{ cursor: 'pointer', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <FaSignOutAlt style={{ fontSize: '1.1rem' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cerrar sesión</span>
        </div>
      </div>
    </div>
  )
}
