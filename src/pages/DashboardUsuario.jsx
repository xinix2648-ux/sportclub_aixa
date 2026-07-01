import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner, Modal, Button } from 'react-bootstrap'
import { FaCalendarCheck, FaDumbbell, FaClock, FaFire, FaEye, FaQuoteLeft, FaUserTie, FaMapMarkerAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import { getUser } from '../services/authService'

export default function DashboardUsuario() {
  const [userData, setUserData] = useState(null)
  const [reservations, setReservations] = useState([])
  const [classes, setClasses] = useState([])
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('reservas')
  const [showDetail, setShowDetail] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/member/dashboard'),
      api.get('/member/classes'),
      api.get('/reservations/my-reservations'),
    ])
      .then(([meRes, dashRes, classesRes, reservationsRes]) => {
        setUserData(meRes.data.data)
        setDashData(dashRes.data.data)
        setClasses(classesRes.data.data || [])
        setReservations(reservationsRes.data.data || [])
      })
      .catch(() => {
        const fallback = getUser()
        setUserData(fallback)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos del panel', timer: 3000, showConfirmButton: false })
      })
      .finally(() => setLoading(false))
  }, [])

  const activeReservations = reservations.filter((r) => r.status === 'active')

  const mappedReservations = reservations.map((r) => {
    const cs = r.classSchedule || {}
    const sr = cs.sportRoom || {}
    return {
      id: r.id,
      date: cs.day_of_week ? `Día ${cs.day_of_week}` : '—',
      time: cs.start_time?.slice(0, 5) || '—',
      type: sr.sport?.name || '—',
      coach: sr.coach?.full_name || sr.coach?.email || '—',
      status: r.status === 'active' ? 'Activa' : r.status === 'cancelled' ? 'Cancelada' : r.status,
      location: sr.room?.name || '—',
    }
  })

  const mappedClasses = classes.map((c) => {
    const scheduleStr = (c.schedules || []).map((sch) =>
      `Día ${sch.day_of_week} ${sch.start_time?.slice(0, 5)}`
    ).join(', ') || '—'
    return {
      id: c.id,
      name: c.sport?.name || '—',
      coach: c.coach?.full_name || c.coach?.email || '—',
      schedule: scheduleStr,
      spots: c.room?.capacity || '—',
      duration: c.sport?.duration ? `${c.sport.duration} min` : '—',
      level: c.sport?.objective || 'General',
      location: c.room?.name || '—',
    }
  })

  const stats = [
    { icon: <FaCalendarCheck size={24} />, label: 'Reservas activas', value: activeReservations.length.toString(), key: 'reservas', color: 'var(--user-color)' },
    { icon: <FaDumbbell size={24} />, label: 'Clases disponibles', value: (dashData?.available_classes ?? classes.length).toString(), key: 'clases', color: 'var(--user-color)' },
    { icon: <FaClock size={24} />, label: 'Próximas clases', value: (dashData?.available_classes ?? classes.length).toString(), key: 'horas', color: 'var(--user-color)' },
    { icon: <FaFire size={24} />, label: 'Deportes', value: (dashData?.available_sports ?? '—').toString(), key: 'racha', color: 'var(--user-color)' },
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
                {mappedReservations.length === 0 ? (
                  <p className="small-text text-center py-3">No tienes reservas</p>
                ) : (
                  <Table className="table-custom mb-0" size="sm">
                    <thead><tr><th>Día</th><th>Hora</th><th>Clase</th><th>Estado</th><th></th></tr></thead>
                    <tbody>
                      {mappedReservations.map((r) => (
                        <tr key={r.id}>
                          <td>{r.date}</td><td>{r.time}</td><td>{r.type}</td>
                          <td><span className={`badge-role ${r.status === 'Activa' ? 'badge-coach' : 'badge-user'}`}>{r.status}</span></td>
                          <td><Button variant="outline-dark" size="sm" onClick={() => setShowDetail(r)}><FaEye /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            ) : (
              <div className="list-card card-bg-dashboard">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaDumbbell style={{ color: 'var(--user-color)' }} /> Clases Disponibles
                </h5>
                {mappedClasses.length === 0 ? (
                  <p className="small-text text-center py-3">No hay clases disponibles</p>
                ) : (
                  <Table className="table-custom mb-0" size="sm">
                    <thead><tr><th>Clase</th><th>Entrenador</th><th>Horario</th><th>Cupos</th><th></th></tr></thead>
                    <tbody>
                      {mappedClasses.map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td><td>{c.coach}</td><td>{c.schedule}</td>
                          <td><span className="badge-role badge-user">{c.spots}</span></td>
                          <td><Button variant="outline-dark" size="sm" onClick={() => setShowDetail(c)}><FaEye /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}
          </Col>
          <Col lg={6}>
            {view === 'reservas' ? (
              <div className="list-card card-bg-gym">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaDumbbell style={{ color: 'var(--user-color)' }} /> Clases Disponibles
                </h5>
                {mappedClasses.length === 0 ? (
                  <p className="small-text text-center py-3">No hay clases disponibles</p>
                ) : (
                  <Table className="table-custom mb-0" size="sm">
                    <thead><tr><th>Clase</th><th>Entrenador</th><th>Horario</th><th>Cupos</th></tr></thead>
                    <tbody>
                      {mappedClasses.slice(0, 5).map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td><td>{c.coach}</td><td>{c.schedule}</td>
                          <td><span className="badge-role badge-user">{c.spots}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            ) : (
              <div className="list-card card-bg-gym">
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaCalendarCheck style={{ color: 'var(--user-color)' }} /> Mis Reservas
                </h5>
                {mappedReservations.length === 0 ? (
                  <p className="small-text text-center py-3">No tienes reservas</p>
                ) : (
                  <Table className="table-custom mb-0" size="sm">
                    <thead><tr><th>Día</th><th>Hora</th><th>Clase</th><th>Estado</th></tr></thead>
                    <tbody>
                      {mappedReservations.map((r) => (
                        <tr key={r.id}>
                          <td>{r.date}</td><td>{r.time}</td><td>{r.type}</td>
                          <td><span className={`badge-role ${r.status === 'Activa' ? 'badge-coach' : 'badge-user'}`}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
                    <tr><td className="small-text">Horario</td><td><strong>{showDetail.date} {showDetail.time}</strong></td></tr>
                    <tr><td className="small-text">Entrenador</td><td><strong><FaUserTie className="me-1" />{showDetail.coach}</strong></td></tr>
                    <tr><td className="small-text">Ubicación</td><td><strong><FaMapMarkerAlt className="me-1" />{showDetail.location}</strong></td></tr>
                    <tr><td className="small-text">Estado</td><td><span className={`badge-role ${showDetail.status === 'Activa' ? 'badge-coach' : 'badge-user'}`}>{showDetail.status}</span></td></tr>
                  </tbody>
                </table>
              ) : (
                <table className="table table-custom table-borderless mb-0">
                  <tbody>
                    <tr><td className="small-text">Clase</td><td><strong>{showDetail.name}</strong></td></tr>
                    <tr><td className="small-text">Entrenador</td><td><strong><FaUserTie className="me-1" />{showDetail.coach}</strong></td></tr>
                    <tr><td className="small-text">Horario</td><td><strong>{showDetail.schedule}</strong></td></tr>
                    <tr><td className="small-text">Duración</td><td><strong>{showDetail.duration}</strong></td></tr>
                    <tr><td className="small-text">Nivel</td><td><strong>{showDetail.level}</strong></td></tr>
                    <tr><td className="small-text">Ubicación</td><td><strong><FaMapMarkerAlt className="me-1" />{showDetail.location}</strong></td></tr>
                    <tr><td className="small-text">Cupos</td><td><strong>{showDetail.spots}</strong></td></tr>
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
