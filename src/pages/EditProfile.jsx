import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import { getUser } from '../services/authService'

const roleColors = { User: 'var(--user-color)', Coach: 'var(--coach-color)', Admin: 'var(--admin-color)' }

export default function EditProfile() {
  const navigate = useNavigate()
  const user = getUser()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??'
  const accent = roleColors[user?.role] || 'var(--purple)'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword && newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }
    setLoading(true)
    try {
      const payload = { name, email }
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }
      await api.put('/profile', payload)
      setSuccess('Perfil actualizado correctamente')
      setTimeout(() => navigate(0), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar perfil')
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
              fontWeight: 700, fontSize: '1.8rem', color: '#fff',
              margin: '0 auto'
            }}>
              {initials}
            </div>
            <h5 className="mt-3 mb-0 text-white">{user?.name}</h5>
            <p className="small-text">{user?.email}</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          {success && <Alert variant="success" className="py-2 small">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <h6 className="text-white mb-3">Información personal</h6>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Nombre completo</Form.Label>
                  <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small-text">Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-white mb-3">Cambiar contraseña</h6>
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small-text">Contraseña actual</Form.Label>
                  <Form.Control type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small-text">Nueva contraseña</Form.Label>
                  <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mín. 6 caracteres" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small-text">Confirmar nueva</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la nueva" />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button type="submit" className="btn-gold" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </DashboardLayout>
  )
}
