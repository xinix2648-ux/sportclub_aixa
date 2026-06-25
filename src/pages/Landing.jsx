import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FaDumbbell, FaHeart, FaUsers, FaCalendarCheck, FaShieldAlt, FaBrain } from 'react-icons/fa'

const benefits = [
  { icon: <FaDumbbell size={32} />, title: 'Equipamiento de élite', text: 'Máquinas de última generación y peso libre para todos los niveles.' },
  { icon: <FaUsers size={32} />, title: 'Entrenadores expertos', text: 'Profesionales certificados que te guiarán en cada paso.' },
  { icon: <FaCalendarCheck size={32} />, title: 'Clases variadas', text: 'Yoga, CrossFit, Spinning y más para mantenerte motivado.' },
  { icon: <FaHeart size={32} />, title: 'Comunidad activa', text: 'Únete a miles de miembros que comparten tu pasión por el fitness.' },
  { icon: <FaShieldAlt size={32} />, title: 'Ambiente seguro', text: 'Instalaciones limpias, seguras y con los mejores protocolos.' },
  { icon: <FaBrain size={32} />, title: 'Bienestar integral', text: 'Cuerpo y mente: programas de nutrición y salud mental.' },
]

const quotes = [
  { text: 'El dolor es temporal. La gloria es para siempre.', author: '— Lance Armstrong' },
  { text: 'No te limites a soñar con tus metas, ¡levántate y haz que sucedan!', author: '— Muhammad Ali' },
  { text: 'El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.', author: '— Albert Schweitzer' },
]

export default function Landing() {
  return (
    <>
      <nav className="navbar-glass fixed-top px-4 py-2 d-flex justify-content-between align-items-center" style={{ zIndex: 1030 }}>
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <img src="/logo.png" alt="Porcinos" height="42" />
          <span className="fw-bold text-pink" style={{ fontSize: '1.3rem' }}>Porcinos Sport Club</span>
        </Link>
        <div className="d-flex gap-2">
          <Link to="/login"><Button variant="outline-dark" size="sm" className="rounded-pill px-3">Ingresar</Button></Link>
          <Link to="/register"><Button className="btn-pink btn-sm rounded-pill px-3">Registro</Button></Link>
        </div>
      </nav>

      <section className="position-relative d-flex align-items-center" style={{ minHeight: '100vh', overflow: 'hidden', paddingTop: '70px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 40%, #e8eaf6 100%)',
        }} />
        <Container className="position-relative">
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <img src="/logo.png" alt="Porcinos" height="100" className="mb-3" />
              <h1 className="display-3 fw-bold text-pink mb-3">PORCINOS SPORT CLUB</h1>
              <p className="fs-5 text-secondary mb-4" style={{ maxWidth: 500 }}>
                Donde la pasión por el deporte se encuentra con la fuerza de una manada. 
                Entrena como un porcino, vive como un campeón.
              </p>
              <Link to="/register">
                <Button className="btn-pink btn-lg rounded-pill px-5 py-3 fs-5">Comienza hoy</Button>
              </Link>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <img src="/persona-ejercitando.jpg" alt="Entrenamiento" className="img-fluid rounded-4 shadow-lg" style={{ maxHeight: 500, objectFit: 'cover' }} />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5" style={{ background: '#fff' }}>
        <Container>
          <h2 className="text-center text-pink fw-bold mb-1">¿Por qué elegirnos?</h2>
          <p className="text-center small-text mb-5">Todo lo que necesitas para alcanzar tus metas</p>
          <Row className="g-4">
            {benefits.map((b, i) => (
              <Col md={6} lg={4} key={i}>
                <div className="glass-card p-4 h-100 text-center" style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="text-pink mb-3">{b.icon}</div>
                  <h5 className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{b.title}</h5>
                  <p className="small-text mb-0">{b.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5" style={{ background: 'var(--bg-base)' }}>
        <Container>
          <Row className="g-4">
            {quotes.map((q, i) => (
              <Col md={4} key={i}>
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center" style={{ minHeight: 180 }}>
                  <p className="fs-5 fw-light fst-italic mb-2" style={{ color: 'var(--text-primary)' }}>"{q.text}"</p>
                  <p className="small-text mb-0 text-end">{q.author}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 position-relative" style={{ minHeight: 400, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
        }} />
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="text-pink fw-bold mb-3">Nuestra Visión</h2>
              <p className="fs-5 text-secondary">
                Ser el club deportivo que transforma vidas a través del movimiento. Creemos en el poder del deporte
                para forjar carácter, construir comunidad y desbloquear el potencial que llevas dentro.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 position-relative" style={{ minHeight: 450, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-principal.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }} />
        <Container className="position-relative h-100 d-flex align-items-center">
          <Row className="justify-content-center w-100">
            <Col md={8} className="text-center">
              <h2 className="text-white fw-bold mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>¿Listo para el desafío?</h2>
              <p className="fs-5 text-white-50 mb-4">
                Únete a la manada. Primera semana gratis sin compromiso.
              </p>
              <Link to="/register">
                <Button className="btn-pink btn-lg rounded-pill px-5 py-3 fs-5">Quiero ser parte</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="py-4 text-center" style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <img src="/logo.png" alt="Porcinos" height="35" />
            <span className="fw-bold text-pink">Porcinos Sport Club</span>
          </div>
          <p className="small-text mb-0">&copy; {new Date().getFullYear()} Porcinos Sport Club. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </>
  )
}
