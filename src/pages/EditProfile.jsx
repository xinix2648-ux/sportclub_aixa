import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import { getUser } from '../services/authService'
import Swal from 'sweetalert2'

const roleColors = { user: 'var(--user-color)', coach: 'var(--coach-color)', admin: 'var(--admin-color)' }

export default function EditProfile() {
  const navigate = useNavigate()
  const user = getUser()

  if (!user) {
    return (
      <DashboardLayout>
        <Container fluid className="px-0" style={{ maxWidth: 700 }}>
          <div className="text-center py-5">
            <p className="small-text">No se pudo cargar la información del usuario.</p>
            <Button variant="outline-dark" size="sm" onClick={() => navigate('/login')}>Ir a iniciar sesión</Button>
          </div>
        </Container>
      </DashboardLayout>
    )
  }

  const [full_name, setFullName] = useState(user.full_name || '')
  const [email, setEmail] = useState(user.email || '')
  const [current_password, setCurrentPassword] = useState('')
  const [new_password, setNewPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = user.full_name ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??'
  const accent = roleColors[user.role] || 'var(--pink)'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.put('/auth/me', { full_name, email })
      const updated = res.data.data
      localStorage.setItem('user', JSON.stringify(updated))

      if (new_password || current_password) {
        if (new_password !== confirm_password) {
          setError('Las contraseñas no coinciden')
          setLoading(false)
          return
        }
        if (!current_password) {
          setError('Debes ingresar tu contraseña actual')
          setLoading(false)
          return
        }
        await api.put('/auth/me/password', { current_password, new_password, confirm_password })
      }

      Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Perfil actualizado correctamente', timer: 1500, showConfirmButton: false })
      setTimeout(() => navigate(`/dashboard/${user.role}`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Container fluid className="px-0" style={{ maxWidth: 700 }}>
        <h2 className="mb-1" style={{ color: accent }}>Editar Perfil</h2>
        <p className="small-text mb-4">Actualiza tus datos personales</p>
        <div className="glass-card p-4 p-md-5">
          <div className="text-center mb-4">
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.8rem', color: '#fff', margin: '0 auto'
            }}>
              {initials}
            </div>
            <h5 className="mt-3 mb-0" style={{ color: 'var(--text-primary)' }}>{user?.full_name}</h5>
            <p className="small-text">{user?.email}</p>
          </div>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Nombre completo</Form.Label>
                  <Form.Control autoComplete="name" value={full_name} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Email</Form.Label>
                  <Form.Control type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
                </Form.Group>
              </Col>
            </Row>
            <h6 className="mb-3" style={{ color: 'var(--text-primary)' }}>Cambiar contraseña</h6>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Contraseña actual</Form.Label>
              <Form.Control type="password" autoComplete="current-password" value={current_password} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Ingresa tu contraseña actual" />
            </Form.Group>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Nueva contraseña</Form.Label>
                  <Form.Control type="password" autoComplete="new-password" value={new_password} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mín. 8 caracteres" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Confirmar contraseña</Form.Label>
                  <Form.Control type="password" autoComplete="new-password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la contraseña" />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button type="submit" className="btn-pink" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </DashboardLayout>
  )
}
