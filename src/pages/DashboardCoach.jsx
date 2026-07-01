import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner, Modal, Button, Form } from 'react-bootstrap'
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaSearch, FaEye, FaDumbbell, FaClock, FaMapMarkerAlt, FaQuoteLeft } from 'react-icons/fa'
import Swal from 'sweetalert2'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const DAYS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function DashboardCoach() {
  const [students, setStudents] = useState([])
  const [myClasses, setMyClasses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetail, setShowDetail] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/users', { params: { role: 'user' } }),
      api.get('/coach/dashboard'),
      api.get('/coach/my-classes'),
      api.get('/coach/my-schedules'),
    ])
      .then(([usersRes, dashRes, classesRes, schedulesRes]) => {
        setStudents(usersRes.data.data || [])
        setDashData(dashRes.data.data)
        setMyClasses(classesRes.data.data || [])
        setSchedules(schedulesRes.data.data || [])
      })
      .catch(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos del panel', timer: 3000, showConfirmButton: false })
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredStudents = students.filter((s) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return s.full_name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term)
  })

  const totalHours = schedules.reduce((acc, s) => {
    if (s.start_time && s.end_time) {
      const start = s.start_time.split(':').map(Number)
      const end = s.end_time.split(':').map(Number)
      return acc + (end[0] - start[0]) + (end[1] - start[1]) / 60
    }
    return acc
  }, 0)

  const stats = [
    { icon: <FaUserGraduate size={24} />, label: 'Alumnos', value: students.length, color: 'var(--coach-color)' },
    { icon: <FaChalkboardTeacher size={24} />, label: 'Clases activas', value: dashData?.total_classes ?? myClasses.length, color: 'var(--coach-color)' },
    { icon: <FaCalendarAlt size={24} />, label: 'Horas/semana', value: `${Math.round(totalHours)}h`, color: 'var(--coach-color)' },
    { icon: <FaClipboardList size={24} />, label: 'Total alumnos', value: students.length, color: 'var(--coach-color)' },
  ]

  const schedulesByDay = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--coach-color)' }}>Panel de Entrenador</h2>
        <p className="small-text mb-2">Gestiona tus alumnos y clases</p>
        <div className="motivational-quote mb-4">
          <FaQuoteLeft className="me-2" style={{ color: 'var(--coach-color)', fontSize: '0.8rem' }} />
          <span className="quote-text">Un buen entrenador puede cambiar un juego. Un gran entrenador puede cambiar una vida. Tú eres ese guía.</span>
          <div className="quote-author">— Porcinos Sport Club</div>
        </div>

        {loading ? <div className="text-center py-5"><Spinner variant="dark" /></div> : (
          <>
            <Row className="g-3 mb-4">
              {stats.map((s, i) => (
                <Col xs={6} lg={3} key={i}>
                  <div className="stat-card d-flex align-items-center gap-3">
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
                <div className="list-card">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <h5 className="mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <FaUserGraduate style={{ color: 'var(--coach-color)' }} /> Mis Alumnos
                    </h5>
                    <div className="position-relative">
                      <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 12 }} />
                      <Form.Control
                        size="sm"
                        placeholder="Buscar alumno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: 30, width: 200, borderRadius: 20 }}
                      />
                    </div>
                  </div>
                  <Table className="table-custom mb-0" size="sm">
                    <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr><td colSpan={4} className="text-center small-text py-3">No se encontraron alumnos</td></tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr key={s.id}>
                            <td>{s.full_name}</td>
                            <td className="small-text">{s.email}</td>
                            <td><span className="badge-role badge-user">Atleta</span></td>
                            <td><Button variant="outline-dark" size="sm" onClick={() => setShowDetail(s)}><FaEye /></Button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col lg={6}>
                <div className="list-card card-bg-gym">
                  <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FaChalkboardTeacher style={{ color: 'var(--coach-color)' }} /> Clases Asignadas
                  </h5>
                  {myClasses.length === 0 ? (
                    <p className="small-text text-center py-3">No tienes clases asignadas</p>
                  ) : (
                    <Table className="table-custom mb-0" size="sm">
                      <thead><tr><th>Clase</th><th>Horario</th><th>Sala</th><th>Deporte</th></tr></thead>
                      <tbody>
                        {myClasses.map((c) => {
                          const scheduleStr = (c.schedules || []).map((sch) =>
                            `${DAYS[sch.day_of_week] || ''} ${sch.start_time?.slice(0, 5) || ''}-${sch.end_time?.slice(0, 5) || ''}`
                          ).join(', ') || '—'
                          return (
                            <tr key={c.id}>
                              <td>{c.sport?.name || '—'}</td>
                              <td className="small-text">{scheduleStr}</td>
                              <td>{c.room?.name || '—'}</td>
                              <td><span className="badge-role badge-coach">{c.sport?.name || '—'}</span></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <div className="list-card card-bg-club">
                  <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FaCalendarAlt style={{ color: 'var(--coach-color)' }} /> Mi Horario
                  </h5>
                  {schedulesByDay.length === 0 ? (
                    <p className="small-text text-center py-3">No tienes horarios asignados</p>
                  ) : (
                    <Table className="table-custom mb-0" size="sm">
                      <thead><tr><th>Día</th><th>Horario</th><th>Actividad</th><th>Sala</th></tr></thead>
                      <tbody>
                        {schedulesByDay.map((s, i) => (
                          <tr key={s.id || i}>
                            <td><strong>{DAYS[s.day_of_week] || '—'}</strong></td>
                            <td><span className="small-text"><FaClock className="me-1" />{s.start_time?.slice(0, 5) || '—'} - {s.end_time?.slice(0, 5) || '—'}</span></td>
                            <td><FaDumbbell className="me-1" />{s.sportRoom?.sport?.name || '—'}</td>
                            <td><span className="small-text"><FaMapMarkerAlt className="me-1" />{s.sportRoom?.room?.name || '—'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>

      <Modal show={!!showDetail} onHide={() => setShowDetail(null)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>Detalle del Alumno</Modal.Title></Modal.Header>
        <Modal.Body>
          {showDetail && (
            <div>
              <div className="text-center mb-4">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--coach-color), var(--coach-color)88)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.5rem', color: '#fff', margin: '0 auto'
                }}>
                  {showDetail.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                </div>
                <h5 className="mt-2 mb-0">{showDetail.full_name}</h5>
                <span className="badge-role badge-user">Atleta</span>
              </div>
              <table className="table table-custom table-borderless mb-0">
                <tbody>
                  <tr><td className="small-text" style={{ width: 140 }}>ID</td><td><strong>{showDetail.id}</strong></td></tr>
                  <tr><td className="small-text">Email</td><td><strong>{showDetail.email}</strong></td></tr>
                  <tr><td className="small-text">Fecha nac.</td><td><strong>{showDetail.birth_date || '—'}</strong></td></tr>
                  <tr><td className="small-text">Rol</td><td><span className="badge-role badge-user">Atleta</span></td></tr>
                </tbody>
              </table>
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
