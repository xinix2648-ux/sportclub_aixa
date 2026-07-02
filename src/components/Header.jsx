import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { getUser, logout } from '../services/authService'

const roleColors = { user: 'var(--user-color)', coach: 'var(--coach-color)', admin: 'var(--admin-color)' }
const roleLabels = { user: 'Atleta', coach: 'Entrenador', admin: 'Admin' }

export default function Header() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
        navigate('/login', { replace: true })
      }
    })
  }

  const initials = user?.full_name ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??'

  return (
    <Navbar className="navbar-glass px-3" fixed="top" style={{ zIndex: 1030 }}>
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Porcinos" height="38" />
          <span className="fw-bold text-pink d-none d-sm-inline" style={{ fontSize: '1.1rem' }}>Porcinos Sport Club</span>
        </Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          <span className="badge-role" style={{
            background: `${roleColors[user?.role]}15`,
            color: roleColors[user?.role],
            border: `1px solid ${roleColors[user?.role]}30`
          }}>
            {roleLabels[user?.role] || user?.role}
          </span>
          <NavDropdown align="end" title={
            <div className="d-inline-flex align-items-center gap-2">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleColors[user?.role] || '#e91e63'}, ${roleColors[user?.role] || '#e91e63'}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', color: '#fff'
              }}>
                {initials}
              </div>
              <span className="text-dark d-none d-md-inline" style={{ fontSize: '0.9rem' }}>{user?.full_name}</span>
            </div>
          } id="user-dropdown" drop="start">
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <NavDropdown.Item onClick={() => navigate('/dashboard/perfil')} className="text-dark">
                Editar perfil
              </NavDropdown.Item>
              <NavDropdown.Divider style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Cerrar sesión
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}
