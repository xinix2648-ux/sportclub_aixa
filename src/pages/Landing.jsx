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
      {/* --- NAV --- */}
      <nav className="navbar-glass fixed-top px-4 py-2 d-flex justify-content-between align-items-center">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <img src="/logo-icon.svg" alt="Gorila SportClub" height="40" />
          <span className="fw-bold text-gold" style={{ fontSize: '1.3rem' }}>Gorila SportClub</span>
        </Link>
        <div className="d-flex gap-2">
          <Link to="/login"><Button variant="outline-light" size="sm" className="rounded-pill px-3">Ingresar</Button></Link>
          <Link to="/register"><Button className="btn-gold btn-sm rounded-pill px-3">Registro</Button></Link>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="position-relative" style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/gym-interior.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.35)',
        }} />
        <div className="position-relative d-flex flex-column align-items-center justify-content-center text-center px-3" style={{ minHeight: '100vh' }}>
          <img src="/logo-icon.svg" alt="Gorila" height="90" className="mb-3" />
          <h1 className="display-3 fw-bold text-gold mb-3" style={{ textShadow: '0 0 40px rgba(242,183,5,0.3)' }}>
            GORILA SPORTCLUB
          </h1>
          <p className="fs-5 text-white-50 mb-4" style={{ maxWidth: 600 }}>
            Donde la fuerza encuentra su propósito. Entrena como un gorila, vive como un campeón.
          </p>
          <Link to="/register">
            <Button className="btn-gold btn-lg rounded-pill px-5 py-3 fs-5">Comienza hoy</Button>
          </Link>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section className="py-5" style={{ background: '#0e0b1e' }}>
        <Container>
          <h2 className="text-center text-gold fw-bold mb-1">¿Por qué elegirnos?</h2>
          <p className="text-center small-text mb-5">Todo lo que necesitas para alcanzar tus metas</p>
          <Row className="g-4">
            {benefits.map((b, i) => (
              <Col md={6} lg={4} key={i}>
                <div className="glass-card p-4 h-100 text-center">
                  <div className="text-gold mb-3">{b.icon}</div>
                  <h5 className="text-white fw-semibold">{b.title}</h5>
                  <p className="small-text mb-0">{b.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* --- QUOTES --- */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {quotes.map((q, i) => (
              <Col md={4} key={i}>
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center" style={{ minHeight: 180 }}>
                  <p className="fs-5 fw-light text-white fst-italic mb-2">"{q.text}"</p>
                  <p className="small-text mb-0 text-end">{q.author}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* --- VISION --- */}
      <section className="py-5 position-relative" style={{ minHeight: 400, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/treadmills.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="text-gold fw-bold mb-3">Nuestra Visión</h2>
              <p className="fs-5 text-white-50">
                Ser el club deportivo que transforma vidas a través del movimiento. Creemos en el poder del deporte
                para forjar carácter, construir comunidad y desbloquear el potencial que llevas dentro.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- CTA --- */}
      <section className="py-5 position-relative" style={{ minHeight: 400, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/Gemini_Generated_Image_dkb4zadkb4zadkb4.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <Container className="position-relative h-100 d-flex align-items-center">
          <Row className="justify-content-center w-100">
            <Col md={8} className="text-center">
              <h2 className="text-gold fw-bold mb-3">¿Listo para el desafío?</h2>
              <p className="fs-5 text-white-50 mb-4">
                Únete a la manada. Primera semana gratis sin compromiso.
              </p>
              <Link to="/register">
                <Button className="btn-gold btn-lg rounded-pill px-5 py-3 fs-5">Quiero ser parte</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-4 text-center" style={{ background: '#0e0b1e', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <img src="/logo-icon.svg" alt="Gorila SportClub" height="30" />
            <span className="fw-bold text-gold">Gorila SportClub</span>
          </div>
          <p className="small-text mb-0">&copy; {new Date().getFullYear()} Gorila SportClub. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </>
  )
}
