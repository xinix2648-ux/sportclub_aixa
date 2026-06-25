import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap'
import { FaUsers, FaUserShield, FaChartLine, FaCogs } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const initialForm = { full_name: '', email: '', password: '', role: 'user' }

export default function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadUsers = () => {
    setLoading(true)
    api.get('/users').then((res) => setUsers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const openCreate = () => {
    setEditing(null); setForm(initialForm); setError(''); setShowModal(true)
  }

  const openEdit = (user) => {
    setEditing(user); setForm({ full_name: user.full_name, email: user.email, password: '', role: user.role }); setError(''); setShowModal(true)
  }

  const handleSave = async () => {
    setError(''); setSaving(true)
    try {
      if (editing) {
        const payload = { full_name: form.full_name, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/users/${editing.id}`, payload)
      } else {
        await api.post('/users', { ...form, birth_date: null, metadata: { sports: [] } })
      }
      setShowModal(false); loadUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const roleBadgeClass = (role) => {
    if (role === 'admin') return 'badge-admin'
    if (role === 'coach') return 'badge-coach'
    return 'badge-user'
  }
  const roleLabel = (role) => {
    if (role === 'admin') return 'Admin'
    if (role === 'coach') return 'Coach'
    return 'User'
  }

  const adminCount = users.filter((u) => u.role === 'admin').length
  const coachCount = users.filter((u) => u.role === 'coach').length
  const userCount = users.filter((u) => u.role === 'user').length

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--admin-color)' }}>Panel de Administración</h2>
        <p className="small-text mb-4">Control total del sistema Porcinos Sport Club</p>
        <Row className="g-3 mb-4">
          {[
            { icon: <FaUsers size={24} />, label: 'Usuarios', value: users.length, color: 'var(--admin-color)' },
            { icon: <FaUserShield size={24} />, label: 'Administradores', value: adminCount, color: 'var(--admin-color)' },
            { icon: <FaChartLine size={24} />, label: 'Entrenadores', value: coachCount, color: 'var(--admin-color)' },
            { icon: <FaCogs size={24} />, label: 'Atletas', value: userCount, color: 'var(--admin-color)' },
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
          <Col lg={8}>
            <div className="list-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaUsers style={{ color: 'var(--admin-color)' }} /> Usuarios del Sistema
                </h5>
                <Button className="btn-pink btn-sm" onClick={openCreate}>+ Nuevo</Button>
              </div>
              {loading ? <div className="text-center py-3"><Spinner variant="dark" size="sm" /></div> : (
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="small-text">{u.id}</td>
                        <td>{u.full_name}</td>
                        <td className="small-text">{u.email}</td>
                        <td><span className={`badge-role ${roleBadgeClass(u.role)}`}>{roleLabel(u.role)}</span></td>
                        <td>
                          <Button variant="outline-dark" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Col>
          <Col lg={4}>
            <div className="list-card mb-3">
              <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button className="btn-pink btn-sm" onClick={openCreate}>Crear Usuario</Button>
                <Button variant="outline-dark" size="sm">Ver Reportes</Button>
                <Button variant="outline-dark" size="sm">Configuración</Button>
              </div>
            </div>
            <div className="list-card">
              <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Resumen</h5>
              <p className="small-text mb-1">Total: <strong style={{ color: 'var(--text-primary)' }}>{users.length}</strong></p>
              <p className="small-text mb-1">Admin: <strong style={{ color: 'var(--text-primary)' }}>{adminCount}</strong></p>
              <p className="small-text mb-1">Coach: <strong style={{ color: 'var(--text-primary)' }}>{coachCount}</strong></p>
              <p className="small-text mb-0">Atletas: <strong style={{ color: 'var(--text-primary)' }}>{userCount}</strong></p>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>{editing ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Nombre</Form.Label>
              <Form.Control value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} placeholder="Nombre completo" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@ejemplo.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">{editing ? 'Nueva contraseña' : 'Contraseña'}</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder={editing ? 'Dejar vacío para mantener' : 'Mín. 8 caracteres'} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small-text">Rol</Form.Label>
              <Form.Select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="user">Atleta</option>
                <option value="coach">Entrenador</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button className="btn-pink btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : editing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
