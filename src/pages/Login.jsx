import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap'
import { login } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      const dashboards = { User: '/dashboard/usuario', Coach: '/dashboard/coach', Admin: '/dashboard/admin' }
      navigate(dashboards[user.role])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-gradient d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={4}>
            <div className="auth-card p-4 p-md-5 text-center">
              <Link to="/" className="text-decoration-none">
                <img src="/logo-icon.svg" alt="Gorila SportClub" height="60" className="mb-3" />
                <h3 className="text-gold fw-bold mb-1">Gorila SportClub</h3>
              </Link>
              <p className="small-text mb-4">Inicia sesión en tu cuenta</p>
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="small-text">Email</Form.Label>
                  <Form.Control type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-4 text-start">
                  <Form.Label className="small-text">Contraseña</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="btn-gold w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Iniciar Sesión'}
                </Button>
              </Form>
              <div className="mt-3 d-flex justify-content-between small-text">
                <Link to="/register" className="text-gold text-decoration-none">Registrarse</Link>
                <Link to="/recover" className="text-gold text-decoration-none">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
