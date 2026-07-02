import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { FaUsers, FaUserShield, FaChartLine, FaCogs, FaSearch, FaTimes, FaEye, FaKey, FaFileAlt, FaUserCog, FaQuoteLeft, FaTrash } from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import Swal from 'sweetalert2'

const initialForm = { full_name: '', email: '', password: '', role: 'user' }

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [showReportModal, setShowReportModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailUser, setDetailUser] = useState(null)
  const [showResetPassModal, setShowResetPassModal] = useState(false)
  const [resetPassUser, setResetPassUser] = useState(null)
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [resetVariant, setResetVariant] = useState('danger')

  const loadUsers = useCallback(() => {
    setLoading(true)
    api.get('/users').then((res) => { setUsers(res.data.data || []); setLoading(false) }).catch(() => { setLoading(false); Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los usuarios', timer: 2000, showConfirmButton: false }) })
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const filteredUsers = users.filter((u) => {
    if (filterRole && u.role !== filterRole) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return u.full_name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    }
    return true
  })

  const adminCount = users.filter((u) => u.role === 'admin').length
  const coachCount = users.filter((u) => u.role === 'coach').length
  const userCount = users.filter((u) => u.role === 'user').length

  const stats = [
    { icon: <FaUsers size={24} />, label: 'Usuarios', value: users.length, color: 'var(--admin-color)', filter: null },
    { icon: <FaUserShield size={24} />, label: 'Administradores', value: adminCount, color: 'var(--admin-color)', filter: 'admin' },
    { icon: <FaChartLine size={24} />, label: 'Entrenadores', value: coachCount, color: 'var(--coach-color)', filter: 'coach' },
    { icon: <FaCogs size={24} />, label: 'Atletas', value: userCount, color: 'var(--user-color)', filter: 'user' },
  ]

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

  const handleResetPass = async () => {
    if (!resetPassword || resetPassword.length < 8) {
      setResetVariant('danger'); setResetMsg('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (resetPassword !== resetConfirm) {
      setResetVariant('danger'); setResetMsg('Las contraseñas no coinciden')
      return
    }
    setResetMsg(''); setSaving(true)
    try {
      await api.put(`/users/${resetPassUser.id}`, { password: resetPassword })
      setResetVariant('success'); setResetMsg('Contraseña actualizada correctamente')
      setResetPassword(''); setResetConfirm('')
      setTimeout(() => { setShowResetPassModal(false); setResetMsg('') }, 1200)
    } catch (err) {
      setResetVariant('danger'); setResetMsg(err.response?.data?.message || 'Error al cambiar contraseña')
    } finally { setSaving(false) }
  }

  const openDetail = (user) => {
    setDetailUser(user); setShowDetailModal(true)
  }

  const openResetPass = (user) => {
    setResetPassUser(user); setResetPassword(''); setResetConfirm(''); setResetMsg(''); setShowResetPassModal(true)
  }

  const handleDelete = (user) => {
    Swal.fire({
      title: `¿Eliminar a ${user.full_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/${user.id}`)
          Swal.fire('Eliminado', 'Usuario eliminado correctamente.', 'success')
          loadUsers()
        } catch (err) {
          Swal.fire('Error', err.response?.data?.message || 'No se pudo eliminar.', 'error')
        }
      }
    })
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

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <h2 className="mb-1" style={{ color: 'var(--admin-color)' }}>Panel de Administración</h2>
        <p className="small-text mb-2">Control total del sistema Porcinos Sport Club</p>
        <div className="motivational-quote mb-4">
          <FaQuoteLeft className="me-2" style={{ color: 'var(--pink)', fontSize: '0.8rem' }} />
          <span className="quote-text">Liderar no es mandar, es inspirar. Cada decisión que tomas construye el futuro del club.</span>
          <div className="quote-author">— Admin Porcinos</div>
        </div>

        <Row className="g-3 mb-4">
          {stats.map((s, i) => (
            <Col xs={6} lg={3} key={i}>
              <div
                className="stat-card d-flex align-items-center gap-3"
                style={{
                  cursor: 'pointer',
                  border: filterRole === s.filter ? `2px solid ${s.color}` : '1px solid var(--glass-border)',
                  background: filterRole === s.filter ? `${s.color}08` : 'var(--bg-card)',
                }}
                onClick={() => setFilterRole(filterRole === s.filter ? null : s.filter)}
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
          <Col lg={8}>
            <div className="list-card">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h5 className="mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaUsers style={{ color: 'var(--admin-color)' }} /> Usuarios del Sistema
                  {filterRole && (
                    <Badge bg="" className="badge-role badge-admin ms-2 d-flex align-items-center gap-1" style={{ cursor: 'pointer' }} onClick={() => setFilterRole(null)}>
                      {roleLabel(filterRole)} <FaTimes size={10} />
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge bg="" className="badge-role badge-user ms-1 d-flex align-items-center gap-1" style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')}>
                      "{searchTerm}" <FaTimes size={10} />
                    </Badge>
                  )}
                </h5>
                <div className="d-flex gap-2">
                  <div className="position-relative">
                    <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 12 }} />
                    <Form.Control
                      size="sm"
                      placeholder="Buscar nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: 30, width: 220, borderRadius: 20 }}
                    />
                  </div>
                  <Button className="btn-pink btn-sm" onClick={openCreate}>+ Nuevo</Button>
                </div>
              </div>
              {loading ? <div className="text-center py-3"><Spinner variant="dark" size="sm" /></div> : (
                <Table className="table-custom mb-0" size="sm">
                  <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th style={{ width: 160 }}>Acciones</th></tr></thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="text-center small-text py-3">No se encontraron usuarios</td></tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="small-text">{u.id}</td>
                          <td>{u.full_name}</td>
                          <td className="small-text">{u.email}</td>
                          <td><span className={`badge-role ${roleBadgeClass(u.role)}`}>{roleLabel(u.role)}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-dark" size="sm" onClick={() => openDetail(u)} title="Ver detalles"><FaEye /></Button>
                              <Button variant="outline-dark" size="sm" onClick={() => openEdit(u)} title="Editar"><FaUserCog /></Button>
                              <Button variant="outline-dark" size="sm" onClick={() => openResetPass(u)} title="Resetear contraseña"><FaKey /></Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u)} title="Eliminar"><FaTrash /></Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </Col>
          <Col lg={4}>
            <div className="list-card mb-3 card-bg-club">
              <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Acciones Rápidas</h5>
              <div className="d-grid gap-2">
                <Button className="btn-pink btn-sm" onClick={openCreate}><FaUserCog className="me-1" /> Crear Usuario</Button>
                <Button variant="outline-dark" size="sm" onClick={() => setShowReportModal(true)}><FaFileAlt className="me-1" /> Ver Reportes</Button>
                <Button variant="outline-dark" size="sm" onClick={() => navigate('/dashboard/perfil')}><FaCogs className="me-1" /> Configuración</Button>
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

      <Modal show={showModal} onHide={() => { setShowModal(false); setForm(initialForm); setEditing(null); setError('') }} centered className="modal-custom">
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

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>Detalle del Usuario</Modal.Title></Modal.Header>
        <Modal.Body>
          {detailUser && (
            <div>
              <div className="text-center mb-4">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, var(--admin-color), var(--admin-color)88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.5rem', color: '#fff', margin: '0 auto'
                }}>
                  {detailUser.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                </div>
                <h5 className="mt-2 mb-0">{detailUser.full_name}</h5>
                <span className={`badge-role ${roleBadgeClass(detailUser.role)}`}>{roleLabel(detailUser.role)}</span>
              </div>
              <table className="table table-custom table-borderless mb-0">
                <tbody>
                  <tr><td className="small-text" style={{ width: 140 }}>ID</td><td><strong>{detailUser.id}</strong></td></tr>
                  <tr><td className="small-text">Email</td><td><strong>{detailUser.email}</strong></td></tr>
                  <tr><td className="small-text">Rol</td><td><strong>{roleLabel(detailUser.role)}</strong></td></tr>
                  <tr><td className="small-text">Fecha nac.</td><td><strong>{detailUser.birth_date || '—'}</strong></td></tr>
                  <tr><td className="small-text">Creado</td><td><strong>{detailUser.created_at ? new Date(detailUser.created_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</strong></td></tr>
                  <tr><td className="small-text">Actualizado</td><td><strong>{detailUser.updated_at ? new Date(detailUser.updated_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</strong></td></tr>
                  <tr><td className="small-text">Metadata</td><td><strong>{detailUser.metadata ? JSON.stringify(detailUser.metadata) : '—'}</strong></td></tr>
                  <tr><td className="small-text">Debe cambiar pass</td><td><strong>{detailUser.must_change_password ? 'Sí' : 'No'}</strong></td></tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResetPassModal} onHide={() => setShowResetPassModal(false)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>Resetear Contraseña</Modal.Title></Modal.Header>
        <Modal.Body>
          {resetPassUser && <p className="small-text mb-3">Nueva contraseña para <strong>{resetPassUser.full_name}</strong> ({resetPassUser.email})</p>}
          {resetMsg && <Alert variant={resetVariant} className="py-2 small">{resetMsg}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label className="small-text">Nueva contraseña</Form.Label>
            <Form.Control type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="Mín. 8 caracteres" minLength={8} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small-text">Confirmar contraseña</Form.Label>
            <Form.Control type="password" value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} placeholder="Repite la contraseña" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => { setShowResetPassModal(false); setResetMsg('') }}>Cancelar</Button>
          <Button className="btn-pink btn-sm" onClick={handleResetPass} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Actualizar Contraseña'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg" centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title><FaFileAlt className="me-2" />Reportes del Sistema</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row className="g-3 mb-4">
            <Col xs={4}><div className="text-center p-3" style={{ background: 'var(--bg-base)', borderRadius: 12 }}><h3 className="fw-bold mb-0" style={{ color: 'var(--admin-color)' }}>{users.length}</h3><p className="small-text mb-0">Total</p></div></Col>
            <Col xs={4}><div className="text-center p-3" style={{ background: 'var(--bg-base)', borderRadius: 12 }}><h3 className="fw-bold mb-0" style={{ color: 'var(--admin-color)' }}>{adminCount}</h3><p className="small-text mb-0">Admins</p></div></Col>
            <Col xs={4}><div className="text-center p-3" style={{ background: 'var(--bg-base)', borderRadius: 12 }}><h3 className="fw-bold mb-0" style={{ color: 'var(--admin-color)' }}>{coachCount}</h3><p className="small-text mb-0">Coaches</p></div></Col>
          </Row>
          <div className="mb-4">
            <p className="small-text mb-2">Distribución por rol</p>
            <div className="d-flex gap-1" style={{ height: 28, borderRadius: 14, overflow: 'hidden' }}>
              {users.length > 0 && (
                <>
                  <div style={{ flex: adminCount, background: 'var(--admin-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, minWidth: adminCount > 0 ? 40 : 0 }}>
                    {adminCount > 0 && `Admin ${Math.round(adminCount/users.length*100)}%`}
                  </div>
                  <div style={{ flex: coachCount, background: 'var(--coach-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, minWidth: coachCount > 0 ? 40 : 0 }}>
                    {coachCount > 0 && `Coach ${Math.round(coachCount/users.length*100)}%`}
                  </div>
                  <div style={{ flex: userCount, background: 'var(--user-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, minWidth: userCount > 0 ? 40 : 0 }}>
                    {userCount > 0 && `User ${Math.round(userCount/users.length*100)}%`}
                  </div>
                </>
              )}
            </div>
          </div>
          <h6 className="mb-2" style={{ color: 'var(--text-primary)' }}>Usuarios Registrados</h6>
          <Table className="table-custom mb-0" size="sm">
            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th></tr></thead>
            <tbody>
              {[...users].filter((u) => u.created_at).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((u) => (
                <tr key={u.id}>
                  <td className="small-text">{u.id}</td>
                  <td>{u.full_name}</td>
                  <td className="small-text">{u.email}</td>
                  <td><span className={`badge-role ${roleBadgeClass(u.role)}`}>{roleLabel(u.role)}</span></td>
                  <td className="small-text">{new Date(u.created_at).toLocaleDateString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => setShowReportModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}