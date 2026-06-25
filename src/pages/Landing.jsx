import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FaDumbbell, FaHeart, FaUsers, FaCalendarCheck, FaShieldAlt, FaBrain, FaQuoteLeft, FaStar, FaCheckCircle, FaRocket, FaCrown, FaFire, FaArrowRight } from 'react-icons/fa'

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

const testimonials = [
  { name: 'Carlos Méndez', text: 'Desde que entreno en Porcinos Sport Club mi vida cambió. Bajé 15 kilos y encontré una comunidad increíble.', stars: 5, role: 'Atleta' },
  { name: 'María García', text: 'Los entrenadores son de primer nivel. Las clases de Yoga restaurativo me ayudaron con mi ansiedad.', stars: 5, role: 'Atleta' },
  { name: 'Pedro Soto', text: 'El ambiente es único. Vengo todos los días con gusto. ¡Esto es más que un gimnasio!', stars: 5, role: 'Atleta' },
]

const dailyPhrases = [
  'El único entrenamiento malo es el que no hiciste.',
  'Tu cuerpo puede soportar casi cualquier cosa. Es tu mente la que tienes que convencer.',
  'No cuentes los días, haz que los días cuenten.',
  'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
  'Si duele, es porque está funcionando. Sigue adelante.',
  'El cambio no ocurre de la noche a la mañana, pero ocurre.',
]

const values = [
  { icon: <FaRocket size={28} />, title: 'Excelencia', text: 'Buscamos la mejora continua en cada aspecto del club.' },
  { icon: <FaUsers size={28} />, title: 'Comunidad', text: 'Creemos en el poder del trabajo en equipo y el apoyo mutuo.' },
  { icon: <FaHeart size={28} />, title: 'Pasión', text: 'Amamos lo que hacemos y contagiarnos de esa energía.' },
  { icon: <FaShieldAlt size={28} />, title: 'Respeto', text: 'Todos son bienvenidos. Todos importan. Todos crecemos.' },
]

export default function Landing() {
  const [phraseIndex] = useState(Math.floor(Math.random() * dailyPhrases.length))

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
              <p className="fs-5 text-secondary mb-3" style={{ maxWidth: 500 }}>
                Donde la pasión por el deporte se encuentra con la fuerza de una manada. 
                Entrena como un porcino, vive como un campeón.
              </p>
              <div className="motivational-quote mb-4" style={{ maxWidth: 500 }}>
                <FaQuoteLeft className="me-2" style={{ color: 'var(--pink)', fontSize: '0.8rem' }} />
                <span className="quote-text">{dailyPhrases[phraseIndex]}</span>
              </div>
              <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-lg-start">
                <Link to="/register">
                  <Button className="btn-pink btn-lg rounded-pill px-5 py-3 fs-5"><FaFire className="me-2" />Comienza hoy</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-dark" className="btn-lg rounded-pill px-4 py-3 fs-5">Ya soy miembro</Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <img src="/persona-ejercitando.jpg" alt="Entrenamiento" className="img-fluid rounded-4 shadow-lg" style={{ maxHeight: 500, objectFit: 'cover' }} />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 section-bg-treadmills">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-pink fw-bold mb-1">¿Por qué elegirnos?</h2>
            <p className="small-text">Todo lo que necesitas para alcanzar tus metas</p>
          </div>
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

      <section className="py-5 section-bg-women">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-pink fw-bold mb-1">Frases que inspiran</h2>
            <p className="small-text">La mentalidad correcta lo es todo</p>
          </div>
          <Row className="g-4">
            {quotes.map((q, i) => (
              <Col md={4} key={i}>
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center" style={{ minHeight: 180 }}>
                  <FaQuoteLeft className="mb-2" style={{ color: 'var(--pink)', fontSize: '1.2rem' }} />
                  <p className="fs-5 fw-light fst-italic mb-2" style={{ color: 'var(--text-primary)' }}>"{q.text}"</p>
                  <p className="small-text mb-0 text-end">{q.author}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5" style={{ background: '#fff' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-pink fw-bold mb-1">Nuestros Valores</h2>
            <p className="small-text">Lo que nos define como manada</p>
          </div>
          <Row className="g-4">
            {values.map((v, i) => (
              <Col sm={6} lg={3} key={i}>
                <div className="text-center p-4">
                  <div className="text-pink mb-3">{v.icon}</div>
                  <h5 className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{v.title}</h5>
                  <p className="small-text mb-0">{v.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 section-bg-club">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-pink fw-bold mb-1">Lo que dicen nuestros miembros</h2>
            <p className="small-text">Historias reales de transformación</p>
          </div>
          <Row className="g-4">
            {testimonials.map((t, i) => (
              <Col md={4} key={i}>
                <div className="glass-card p-4 h-100" style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="d-flex gap-1 mb-2" style={{ color: 'var(--gold)' }}>
                    {[...Array(t.stars)].map((_, si) => <FaStar key={si} size={14} />)}
                  </div>
                  <p className="small-text mb-3" style={{ fontStyle: 'italic' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--pink), var(--pink-dark))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.8rem', fontWeight: 700
                    }}>
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="mb-0" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</p>
                      <p className="small-text mb-0">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 section-bg-club position-relative" style={{ minHeight: 400 }}>
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <FaQuoteLeft size={32} className="mb-3" style={{ color: 'var(--pink)', opacity: 0.3 }} />
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
              <FaCrown size={40} className="mb-3" style={{ color: 'var(--gold)' }} />
              <h2 className="text-white fw-bold mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>¿Listo para el desafío?</h2>
              <p className="fs-5 text-white-50 mb-3">
                Únete a la manada. Primera semana gratis sin compromiso.
              </p>
              <p className="text-white-50 small-text mb-4" style={{ fontStyle: 'italic' }}>
                "El momento de empezar es ahora. No esperes a estar listo, porque nunca lo estarás."
              </p>
              <Link to="/register">
                <Button className="btn-pink btn-lg rounded-pill px-5 py-3 fs-5"><FaRocket className="me-2" />Quiero ser parte</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="py-5 text-center" style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <img src="/logo.png" alt="Porcinos" height="40" />
            <span className="fw-bold text-pink" style={{ fontSize: '1.2rem' }}>Porcinos Sport Club</span>
          </div>
          <p className="small-text mb-1">
            Donde la pasión por el deporte se encuentra con la fuerza de una manada.
          </p>
          <div className="d-flex justify-content-center gap-4 my-3">
            <span className="small-text"><FaDumbbell className="me-1" /> CrossFit</span>
            <span className="small-text"><FaHeart className="me-1" /> Yoga</span>
            <span className="small-text"><FaFire className="me-1" /> Spinning</span>
          </div>
          <p className="small-text mb-0" style={{ fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} Porcinos Sport Club. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
    </>
  )
}