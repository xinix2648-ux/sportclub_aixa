import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap'
import { FaCalendarCheck, FaDumbbell, FaClock, FaFire } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const statCards = [
  { icon: <FaCalendarCheck size={24} />, label: 'Reservas activas', value: '3', color: '#4a80c0' },
  { icon: <FaDumbbell size={24} />, label: 'Entrenamientos este mes', value: '12', color: '#4a80c0' },
  { icon: <FaClock size={24} />, label: 'Horas totales', value: '28h', color: '#4a80c0' },
  { icon: <FaFire size={24} />, label: 'Racha actual', value: '5 días', color: '#4a80c0' },
]

const reservations = [
  { id: 1, date: '2026-06-18', time: '09:00', type: 'CrossFit', status: 'Confirmada' },
  { id: 2, date: '2026-06-19', time: '11:00', type: 'Spinning', status: 'Pendiente' },
  { id: 3, date: '2026-06-20', time: '15:00', type: 'Yoga', status: 'Confirmada' },
]

const classes = [
  { id: 1, name: 'CrossFit Intensivo', coach: 'Coach Gorila', schedule: 'Lun, Mie, Vie 09:00', spots: 5 },
  { id: 2, name: 'Yoga Restaurativo', coach: 'Coach Gorila', schedule: 'Mar, Jue 15:00', spots: 8 },
  { id: 3, name: 'Spinning Power', coach: 'Coach Gorila', schedule: 'Lun, Mie 11:00', spots: 3 },
]

export default function DashboardUsuario() {
  return (
    <DashboardLayout role="User">
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--user-color)' }}>Mi Panel</h2>
        <p className="small-text mb-4">Bienvenido a tu espacio de entrenamiento</p>

        <Row className="g-3 mb-4">
          {statCards.map((s, i) => (
            <Col xs={6} lg={3} key={i}>
              <div className="stat-card d-flex align-items-center gap-3">
                <div style={{ color: s.color, background: `${s.color}20`, width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="small-text mb-0">{s.label}</p>
                  <h4 className="fw-bold mb-0 text-white">{s.value}</h4>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <div className="list-card">
              <h5 className="mb-3 text-white d-flex align-items-center gap-2">
                <FaCalendarCheck style={{ color: 'var(--user-color)' }} /> Mis Reservas
              </h5>
              <Table className="table-dark-custom mb-0" size="sm">
                <thead>
                  <tr><th>Fecha</th><th>Hora</th><th>Clase</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.type}</td>
                      <td><span className={`badge-role ${r.status === 'Confirmada' ? 'badge-coach' : 'badge-user'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col lg={6}>
            <div className="list-card">
              <h5 className="mb-3 text-white d-flex align-items-center gap-2">
                <FaDumbbell style={{ color: 'var(--user-color)' }} /> Clases Disponibles
              </h5>
              <Table className="table-dark-custom mb-0" size="sm">
                <thead>
                  <tr><th>Clase</th><th>Entrenador</th><th>Horario</th><th>Cupos</th></tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.coach}</td>
                      <td>{c.schedule}</td>
                      <td><span className="badge-role badge-user">{c.spots} libres</span></td>
                    </tr>
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
