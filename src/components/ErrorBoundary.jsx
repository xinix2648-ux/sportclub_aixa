import { Component } from 'react'
import { Container, Button } from 'react-bootstrap'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-gradient d-flex align-items-center" style={{ minHeight: '100vh' }}>
          <Container className="text-center">
            <img src="/logo.png" alt="Porcinos Sport Club" height="60" className="mb-3" />
            <h3 className="text-pink fw-bold mb-2">Algo salió mal</h3>
            <p className="small-text mb-3">Ocurrió un error inesperado. Por favor, intenta de nuevo.</p>
            <div className="d-flex gap-2 justify-content-center">
              <Button className="btn-pink" onClick={this.handleReset}>
                Intentar de nuevo
              </Button>
              <Button variant="outline-dark" onClick={() => window.location.href = '/'}>
                Volver al inicio
              </Button>
            </div>
          </Container>
        </div>
      )
    }
    return this.props.children
  }
}
