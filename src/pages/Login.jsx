import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap'
import { FaQuoteLeft } from 'react-icons/fa'
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
      if (user?.must_change_password) {
        navigate('/dashboard/perfil')
        return
      }
      const dashboards = { user: '/dashboard/user', coach: '/dashboard/coach', admin: '/dashboard/admin' }
      navigate(dashboards[user.role] || '/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const loginQuotes = [
    'Hoy es un buen día para superarte a ti mismo.',
    'El único límite es el que tú mismo te pongas.',
    'Cada repetición cuenta. Cada paso importa.',
    'La disciplina vence a la motivación cuando la motivación se va.',
    'No se trata de ser el mejor. Se trata de ser mejor que ayer.',
  ]
  const [loginQuote] = useState(loginQuotes[Math.floor(Math.random() * loginQuotes.length)])

  return (
    <div className="auth-gradient d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={4}>
            <div className="auth-card p-4 p-md-5 text-center">
              <Link to="/" className="text-decoration-none">
                <img src="/logo.png" alt="Porcinos Sport Club" height="70" className="mb-3" />
                <h3 className="text-pink fw-bold mb-1">Porcinos Sport Club</h3>
              </Link>
              <div className="motivational-quote mb-4 text-start">
                <FaQuoteLeft className="me-2" style={{ color: 'var(--pink)', fontSize: '0.8rem' }} />
                <span className="quote-text" style={{ fontSize: '0.85rem' }}>{loginQuote}</span>
              </div>
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="small-text">Email</Form.Label>
                  <Form.Control type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-4 text-start">
                  <Form.Label className="small-text">Contraseña</Form.Label>
                  <Form.Control type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="btn-pink w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Iniciar Sesión'}
                </Button>
              </Form>
              <div className="mt-3 d-flex justify-content-between small-text">
                <Link to="/register" className="text-pink text-decoration-none">Registrarse</Link>
                <Link to="/recover" className="text-pink text-decoration-none">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
