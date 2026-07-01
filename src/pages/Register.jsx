import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap'
import { register } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const user = await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        birth_date: null,
        metadata: { sports: [] }
      })
      const dashboards = { user: '/dashboard/user', coach: '/dashboard/coach', admin: '/dashboard/admin' }
      navigate(dashboards[user.role] || '/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-gradient d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={4}>
            <div className="auth-card p-4 p-md-5">
              <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none">
                  <img src="/logo.png" alt="Porcinos Sport Club" height="60" className="mb-2" />
                  <h3 className="text-pink fw-bold">Porcinos Sport Club</h3>
                </Link>
                <p className="small-text">Crea tu cuenta</p>
              </div>
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="small-text">Nombre completo</Form.Label>
                  <Form.Control autoComplete="name" name="full_name" placeholder="Tu nombre" value={form.full_name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="small-text">Email</Form.Label>
                  <Form.Control type="email" autoComplete="email" name="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="small-text">Contraseña</Form.Label>
                  <Form.Control type="password" autoComplete="new-password" name="password" placeholder="Mín. 8 caracteres" value={form.password} onChange={handleChange} required minLength={8} />
                </Form.Group>
                <Form.Group className="mb-4 text-start">
                  <Form.Label className="small-text">Confirmar contraseña</Form.Label>
                  <Form.Control type="password" autoComplete="new-password" name="confirm" placeholder="Repite la contraseña" value={form.confirm} onChange={handleChange} required />
                </Form.Group>
                <Button type="submit" className="btn-pink w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Crear Cuenta'}
                </Button>
              </Form>
              <p className="text-center mt-3 small-text mb-0">
                ¿Ya tienes cuenta? <Link to="/login" className="text-pink text-decoration-none">Inicia sesión</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
