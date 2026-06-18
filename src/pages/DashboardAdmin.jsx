import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap'
import { FaUsers, FaUserShield, FaChartLine, FaCogs } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const initialForm = { name: '', email: '', password: '', role: 'User' }

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
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/users/${editing.id}`, payload)
      } else {
        await api.post('/users', form)
      }
      setShowModal(false)
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      loadUsers()
    } catch {}
  }

  const roleBadgeClass = (role) => {
    if (role === 'Admin') return 'badge-admin'
    if (role === 'Coach') return 'badge-coach'
    return 'badge-user'
  }

  const adminCount = users.filter((u) => u.role === 'Admin').length
  const coachCount = users.filter((u) => u.role === 'Coach').length
  const userCount = users.filter((u) => u.role === 'User').length

  return (
    <DashboardLayout role="Admin">
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--admin-color)' }}>Panel de Administración</h2>
        <p className="small-text mb-4">Control total del sistema Gorila SportClub</p>

        <Row className="g-3 mb-4">
          <Col xs={6} lg={3}>
            <div className="stat-card d-flex align-items-center gap-3">
              <div style={{ color: '#c04060', background: '#c0406020', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUsers size={24} />
              </div>
              <div>
                <p className="small-text mb-0">Usuarios</p>
                <h4 className="fw-bold mb-0 text-white">{users.length}</h4>
              </div>
            </div>
          </Col>
          <Col xs={6} lg={3}>
            <div className="stat-card d-flex align-items-center gap-3">
              <div style={{ color: '#c04060', background: '#c0406020', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUserShield size={24} />
              </div>
              <div>
                <p className="small-text mb-0">Administradores</p>
                <h4 className="fw-bold mb-0 text-white">{adminCount}</h4>
              </div>
            </div>
          </Col>
          <Col xs={6} lg={3}>
            <div className="stat-card d-flex align-items-center gap-3">
              <div style={{ color: '#c04060', background: '#c0406020', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaChartLine size={24} />
              </div>
              <div>
                <p className="small-text mb-0">Entrenadores</p>
                <h4 className="fw-bold mb-0 text-white">{coachCount}</h4>
              </div>
            </div>
          </Col>
          <Col xs={6} lg={3}>
            <div className="stat-card d-flex align-items-center gap-3">
              <div style={{ color: '#c04060', background: '#c0406020', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaCogs size={24} />
              </div>
              <div>
                <p className="small-text mb-0">Atletas</p>
                <h4 className="fw-bold mb-0 text-white">{userCount}</h4>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <div className="list-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-white d-flex align-items-center gap-2">
                  <FaUsers style={{ color: 'var(--admin-color)' }} /> Usuarios del Sistema
                </h5>
                <Button className="btn-gold btn-sm" onClick={openCreate}>+ Nuevo</Button>
              </div>
              {loading ? (
                <div className="text-center py-3"><Spinner variant="light" size="sm" /></div>
              ) : (
                <Table className="table-dark-custom mb-0" size="sm">
                  <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="small-text">{u.id}</td>
                        <td>{u.name}</td>
                        <td className="small-text">{u.email}</td>
                        <td><span className={`badge-role ${roleBadgeClass(u.role)}`}>{u.role}</span></td>
                        <td>
                          <Button variant="outline-light" size="sm" className="me-1" onClick={() => openEdit(u)}>Editar</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}>Eliminar</Button>
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
              <h5 className="mb-3 text-white">Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button className="btn-gold btn-sm" onClick={openCreate}>Crear Usuario</Button>
                <Button variant="outline-light" size="sm">Ver Reportes</Button>
                <Button variant="outline-light" size="sm">Configuración</Button>
              </div>
            </div>
            <div className="list-card">
              <h5 className="mb-3 text-white">Resumen</h5>
              <p className="small-text mb-1">Total: <strong className="text-white">{users.length}</strong></p>
              <p className="small-text mb-1">Admin: <strong className="text-white">{adminCount}</strong></p>
              <p className="small-text mb-1">Coach: <strong className="text-white">{coachCount}</strong></p>
              <p className="small-text mb-0">Atletas: <strong className="text-white">{userCount}</strong></p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Nombre</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nombre completo" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@ejemplo.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">{editing ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder={editing ? '••••••••' : 'Mín. 6 caracteres'} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small-text">Rol</Form.Label>
              <Form.Select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="User">Atleta</option>
                <option value="Coach">Entrenador</option>
                <option value="Admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-light" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button className="btn-gold btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : editing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
