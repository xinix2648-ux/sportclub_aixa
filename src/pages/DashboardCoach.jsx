import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap'
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const myClasses = [
  { id: 1, name: 'CrossFit Intensivo', schedule: 'Lun, Mie, Vie 09:00', students: 12 },
  { id: 2, name: 'Yoga Restaurativo', schedule: 'Mar, Jue 15:00', students: 8 },
  { id: 3, name: 'Spinning Power', schedule: 'Lun, Mie 11:00', students: 15 },
]

const schedule = [
  { day: 'Lunes', time: '09:00 - 10:00', activity: 'CrossFit' },
  { day: 'Martes', time: '15:00 - 16:00', activity: 'Yoga' },
  { day: 'Miércoles', time: '09:00 - 10:00', activity: 'CrossFit' },
  { day: 'Jueves', time: '15:00 - 16:00', activity: 'Yoga' },
  { day: 'Viernes', time: '09:00 - 10:00', activity: 'CrossFit' },
]

export default function DashboardCoach() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users', { params: { role: 'user' } })
      .then((res) => setStudents(res.data.data || []))
      .catch(() => {
        setStudents([
          { id: 1, full_name: 'Usuario Demo 1', email: 'user1@porcinosportclub.cl', role: 'user' },
          { id: 2, full_name: 'Usuario Demo 2', email: 'user2@porcinosportclub.cl', role: 'user' },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--coach-color)' }}>Panel de Entrenador</h2>
        <p className="small-text mb-4">Gestiona tus alumnos y clases</p>
        <Row className="g-3 mb-4">
          {[
            { icon: <FaUserGraduate size={24} />, label: 'Alumnos', value: students.length, color: 'var(--coach-color)' },
            { icon: <FaChalkboardTeacher size={24} />, label: 'Clases activas', value: myClasses.length, color: 'var(--coach-color)' },
            { icon: <FaCalendarAlt size={24} />, label: 'Horas/semana', value: '15h', color: 'var(--coach-color)' },
            { icon: <FaClipboardList size={24} />, label: 'Total alumnos', value: students.length, color: 'var(--coach-color)' },
          ].map((s, i) => (
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
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaUserGraduate style={{ color: 'var(--coach-color)' }} /> Mis Alumnos
              </h5>
              {loading ? <div className="text-center py-3"><Spinner variant="dark" size="sm" /></div> : (
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.full_name}</td>
                        <td className="small-text">{s.email}</td>
                        <td><span className="badge-role badge-user">Atleta</span></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className="list-card">
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaChalkboardTeacher style={{ color: 'var(--coach-color)' }} /> Clases Asignadas
              </h5>
              <Table className="table-custom mb-0" size="sm">
                <thead><tr><th>Clase</th><th>Horario</th><th>Alumnos</th></tr></thead>
                <tbody>
                  {myClasses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td><td>{c.schedule}</td>
                      <td><span className="badge-role badge-coach">{c.students} inscritos</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div className="list-card">
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FaCalendarAlt style={{ color: 'var(--coach-color)' }} /> Mi Horario
              </h5>
              <Table className="table-custom mb-0" size="sm">
                <thead><tr><th>Día</th><th>Horario</th><th>Actividad</th></tr></thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i}><td>{s.day}</td><td>{s.time}</td><td>{s.activity}</td></tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}
