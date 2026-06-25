import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner, Modal, Button } from 'react-bootstrap'
import { FaCalendarCheck, FaDumbbell, FaClock, FaFire, FaEye, FaQuoteLeft } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import { getUser } from '../services/authService'

export default function DashboardUsuario() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('reservas')
  const [showDetail, setShowDetail] = useState(null)

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUserData(res.data.data))
      .catch(() => setUserData(getUser()))
      .finally(() => setLoading(false))
  }, [])

  const reservations = [
    { id: 1, date: '2026-06-25', time: '09:00', type: 'CrossFit', coach: 'Carlos Méndez', status: 'Confirmada', location: 'Sala A' },
    { id: 2, date: '2026-06-26', time: '11:00', type: 'Spinning', coach: 'Ana López', status: 'Pendiente', location: 'Sala B' },
    { id: 3, date: '2026-06-27', time: '15:00', type: 'Yoga', coach: 'María García', status: 'Confirmada', location: 'Sala C' },
  ]

  const classes = [
    { id: 1, name: 'CrossFit Intensivo', coach: 'Carlos Méndez', schedule: 'Lun, Mie, Vie 09:00', spots: 5, duration: '60 min', level: 'Intermedio' },
    { id: 2, name: 'Yoga Restaurativo', coach: 'María García', schedule: 'Mar, Jue 15:00', spots: 8, duration: '45 min', level: 'Todos' },
    { id: 3, name: 'Spinning Power', coach: 'Ana López', schedule: 'Lun, Mie 11:00', spots: 3, duration: '50 min', level: 'Avanzado' },
  ]

  const stats = [
    { icon: <FaCalendarCheck size={24} />, label: 'Reservas activas', value: '3', key: 'reservas', color: 'var(--user-color)' },
    { icon: <FaDumbbell size={24} />, label: 'Clases disponibles', value: classes.length.toString(), key: 'clases', color: 'var(--user-color)' },
    { icon: <FaClock size={24} />, label: 'Horas totales', value: '28h', key: 'horas', color: 'var(--user-color)' },
    { icon: <FaFire size={24} />, label: 'Racha actual', value: '5 días', key: 'racha', color: 'var(--user-color)' },
  ]

  if (loading) return <DashboardLayout><div className="text-center py-5"><Spinner variant="dark" /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--user-color)' }}>Mi Panel</h2>
        <p className="small-text mb-2">Bienvenido, {userData?.full_name || 'Atleta'}</p>
        <div className="motivational-quote mb-4">
          <FaQuoteLeft className="me-2" style={{ color: 'var(--user-color)', fontSize: '0.8rem' }} />
          <span className="quote-text">El dolor que sientes hoy será la fuerza que sentirás mañana. Sigue adelante, cada repetición cuenta.</span>
          <div className="quote-author">— Porcinos Sport Club</div>
        </div>

        <Row className="g-3 mb-4">
          {stats.map((s, i) => (
            <Col xs={6} lg={3} key={i}>
              <div
                className="stat-card d-flex align-items-center gap-3"
                style={{
                  cursor: s.key === 'reservas' || s.key === 'clases' ? 'pointer' : 'default',
                  border: view === s.key ? `2px solid ${s.color}` : '1px solid var(--glass-border)',
                  background: view === s.key ? `${s.color}08` : 'var(--bg-card)',
                }}
                onClick={() => { if (s.key === 'reservas' || s.key === 'clases') setView(s.key) }}
              >
                <div style={{ color: s.color, background: `${s.color}12`, width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="small-text mb-0">{s.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{s.value}</h4>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row className="g-4">
          <Col lg={6}>
            {view === 'reservas' ? (
              <div className="list-card card-bg-dashboard">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaCalendarCheck style={{ color: 'var(--user-color)' }} /> Mis Reservas
                </h5>
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>Fecha</th><th>Hora</th><th>Clase</th><th>Estado</th><th></th></tr></thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td><td>{r.time}</td><td>{r.type}</td>
                        <td><span className={`badge-role ${r.status === 'Confirmada' ? 'badge-coach' : 'badge-user'}`}>{r.status}</span></td>
                        <td><Button variant="outline-dark" size="sm" onClick={() => setShowDetail(r)}><FaEye /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="list-card card-bg-dashboard">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaDumbbell style={{ color: 'var(--user-color)' }} /> Clases Disponibles
                </h5>
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>Clase</th><th>Entrenador</th><th>Horario</th><th>Cupos</th><th></th></tr></thead>
                  <tbody>
                    {classes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td><td>{c.coach}</td><td>{c.schedule}</td>
                        <td><span className="badge-role badge-user">{c.spots} libres</span></td>
                        <td><Button variant="outline-dark" size="sm" onClick={() => setShowDetail(c)}><FaEye /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
          <Col lg={6}>
            {view === 'reservas' ? (
              <div className="list-card card-bg-gym">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaDumbbell style={{ color: 'var(--user-color)' }} /> Clases Disponibles
                </h5>
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>Clase</th><th>Entrenador</th><th>Horario</th><th>Cupos</th></tr></thead>
                  <tbody>
                    {classes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td><td>{c.coach}</td><td>{c.schedule}</td>
                        <td><span className="badge-role badge-user">{c.spots} libres</span></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="list-card card-bg-gym">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaCalendarCheck style={{ color: 'var(--user-color)' }} /> Mis Reservas
                </h5>
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>Fecha</th><th>Hora</th><th>Clase</th><th>Estado</th></tr></thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td><td>{r.time}</td><td>{r.type}</td>
                        <td><span className={`badge-role ${r.status === 'Confirmada' ? 'badge-coach' : 'badge-user'}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={!!showDetail} onHide={() => setShowDetail(null)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>Detalle</Modal.Title></Modal.Header>
        <Modal.Body>
          {showDetail && (
            <div>
              {showDetail.type ? (
                <table className="table table-custom table-borderless mb-0">
                  <tbody>
                    <tr><td className="small-text">Clase</td><td><strong>{showDetail.type}</strong></td></tr>
                    <tr><td className="small-text">Fecha</td><td><strong>{showDetail.date}</strong></td></tr>
                    <tr><td className="small-text">Hora</td><td><strong>{showDetail.time}</strong></td></tr>
                    <tr><td className="small-text">Entrenador</td><td><strong>{showDetail.coach}</strong></td></tr>
                    <tr><td className="small-text">Ubicación</td><td><strong>{showDetail.location}</strong></td></tr>
                    <tr><td className="small-text">Estado</td><td><span className={`badge-role ${showDetail.status === 'Confirmada' ? 'badge-coach' : 'badge-user'}`}>{showDetail.status}</span></td></tr>
                  </tbody>
                </table>
              ) : (
                <table className="table table-custom table-borderless mb-0">
                  <tbody>
                    <tr><td className="small-text">Clase</td><td><strong>{showDetail.name}</strong></td></tr>
                    <tr><td className="small-text">Entrenador</td><td><strong>{showDetail.coach}</strong></td></tr>
                    <tr><td className="small-text">Horario</td><td><strong>{showDetail.schedule}</strong></td></tr>
                    <tr><td className="small-text">Duración</td><td><strong>{showDetail.duration}</strong></td></tr>
                    <tr><td className="small-text">Nivel</td><td><strong>{showDetail.level}</strong></td></tr>
                    <tr><td className="small-text">Cupos</td><td><strong>{showDetail.spots} libres</strong></td></tr>
                  </tbody>
                </table>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => setShowDetail(null)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}