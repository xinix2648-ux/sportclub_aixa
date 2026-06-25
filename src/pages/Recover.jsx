import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap'

export default function Recover() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="auth-gradient d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={6} lg={4}>
            <div className="auth-card p-4 p-md-5 text-center">
              <Link to="/" className="text-decoration-none">
                <img src="/logo.png" alt="Porcinos Sport Club" height="60" className="mb-2" />
                <h3 className="text-pink fw-bold mb-1">Porcinos Sport Club</h3>
              </Link>
              <p className="small-text mb-4">Recupera tu contraseña</p>
              {sent ? (
                <Alert variant="success" className="py-3">
                  Se ha enviado un enlace de recuperación a <strong>{email}</strong>.
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4 text-start">
                    <Form.Label className="small-text">Email registrado</Form.Label>
                    <Form.Control type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit" className="btn-pink w-100">Enviar enlace</Button>
                </Form>
              )}
              <p className="mt-3 small-text mb-0">
                <Link to="/login" className="text-pink text-decoration-none">Volver al inicio de sesión</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
