import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner, Modal, Button, Form } from 'react-bootstrap'
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaSearch, FaEye, FaDumbbell, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const myClasses = [
  { id: 1, name: 'CrossFit Intensivo', schedule: 'Lun, Mie, Vie 09:00', students: 12, level: 'Intermedio', room: 'Sala A' },
  { id: 2, name: 'Yoga Restaurativo', schedule: 'Mar, Jue 15:00', students: 8, level: 'Todos', room: 'Sala C' },
  { id: 3, name: 'Spinning Power', schedule: 'Lun, Mie 11:00', students: 15, level: 'Avanzado', room: 'Sala B' },
]

const schedule = [
  { day: 'Lunes', time: '09:00 - 10:00', activity: 'CrossFit', room: 'Sala A' },
  { day: 'Martes', time: '15:00 - 16:00', activity: 'Yoga', room: 'Sala C' },
  { day: 'Miércoles', time: '09:00 - 10:00', activity: 'CrossFit', room: 'Sala A' },
  { day: 'Jueves', time: '15:00 - 16:00', activity: 'Yoga', room: 'Sala C' },
  { day: 'Viernes', time: '09:00 - 10:00', activity: 'CrossFit', room: 'Sala A' },
]

export default function DashboardCoach() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetail, setShowDetail] = useState(null)

  useEffect(() => {
    api.get('/users', { params: { role: 'user' } })
      .then((res) => setStudents(res.data.data || []))
      .catch(() => {
        setStudents([
          { id: 1, full_name: 'Usuario Demo 1', email: 'user1@porcinosportclub.cl', role: 'user', birth_date: '2000-01-10' },
          { id: 2, full_name: 'Usuario Demo 2', email: 'user2@porcinosportclub.cl', role: 'user', birth_date: '2001-03-22' },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredStudents = students.filter((s) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return s.full_name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term)
  })

  const stats = [
    { icon: <FaUserGraduate size={24} />, label: 'Alumnos', value: students.length, color: 'var(--coach-color)' },
    { icon: <FaChalkboardTeacher size={24} />, label: 'Clases activas', value: myClasses.length, color: 'var(--coach-color)' },
    { icon: <FaCalendarAlt size={24} />, label: 'Horas/semana', value: '15h', color: 'var(--coach-color)' },
    { icon: <FaClipboardList size={24} />, label: 'Total alumnos', value: students.length, color: 'var(--coach-color)' },
  ]

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--coach-color)' }}>Panel de Entrenador</h2>
        <p className="small-text mb-4">Gestiona tus alumnos y clases</p>
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
              {loading ? <div className="text-center py-3"><Spinner variant="dark" size="sm" /></div> : (
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
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className="list-card card-bg-gym">
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaChalkboardTeacher style={{ color: 'var(--coach-color)' }} /> Clases Asignadas
              </h5>
              <Table className="table-custom mb-0" size="sm">
                <thead><tr><th>Clase</th><th>Horario</th><th>Alumnos</th><th>Nivel</th></tr></thead>
                <tbody>
                  {myClasses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td><td>{c.schedule}</td>
                      <td><span className="badge-role badge-coach">{c.students} inscritos</span></td>
                      <td className="small-text">{c.level}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div className="list-card card-bg-club">
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaCalendarAlt style={{ color: 'var(--coach-color)' }} /> Mi Horario
              </h5>
              <Table className="table-custom mb-0" size="sm">
                <thead><tr><th>Día</th><th>Horario</th><th>Actividad</th><th>Sala</th></tr></thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.day}</strong></td>
                      <td><span className="small-text"><FaClock className="me-1" />{s.time}</span></td>
                      <td><FaDumbbell className="me-1" />{s.activity}</td>
                      <td><span className="small-text"><FaMapMarkerAlt className="me-1" />{s.room}</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
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