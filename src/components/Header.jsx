import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import { getUser, logout } from '../services/authService'

const roleColors = { User: 'var(--user-color)', Coach: 'var(--coach-color)', Admin: 'var(--admin-color)' }
const roleLabels = { User: 'Atleta', Coach: 'Entrenador', Admin: 'Admin' }

export default function Header() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??'

  return (
    <Navbar className="navbar-glass px-3" fixed="top" style={{ zIndex: 1030 }}>
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo-icon.svg" alt="Gorila" height="35" />
          <span className="fw-bold text-gold d-none d-sm-inline">Gorila SportClub</span>
        </Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          <span className="badge-role" style={{
            background: `${roleColors[user?.role]}22`,
            color: roleColors[user?.role],
            border: `1px solid ${roleColors[user?.role]}44`
          }}>
            {roleLabels[user?.role] || user?.role}
          </span>
          <NavDropdown align="end" title={
            <div className="d-inline-flex align-items-center gap-2">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleColors[user?.role] || '#4a2c8a'}, ${roleColors[user?.role] || '#4a2c8a'}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', color: '#fff'
              }}>
                {initials}
              </div>
              <span className="text-white d-none d-md-inline" style={{ fontSize: '0.9rem' }}>{user?.name}</span>
            </div>
          } id="user-dropdown" drop="start">
            <div style={{ background: 'rgba(26,20,50,0.95)', backdropFilter: 'blur(12px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
              <NavDropdown.Item onClick={() => navigate('/dashboard/perfil')} className="text-white">
                <i className="bi bi-person me-2"></i>Editar perfil
              </NavDropdown.Item>
              <NavDropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}
