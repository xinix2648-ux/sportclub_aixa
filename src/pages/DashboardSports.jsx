import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { FaDumbbell, FaPlus, FaEdit, FaTrash, FaSync, FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2'
import DashboardLayout from '../components/DashboardLayout'
import { listSports, createSport, updateSport, deleteSport, toggleSportStatus } from '../services/sportService'

const initialForm = { name: '', objective: '', duration: '' }

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
}

export default function DashboardSports() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    listSports().then(setSports).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs = {}
    if (!form.name || form.name.trim().length < 3) errs.name = 'El nombre debe tener al menos 3 caracteres'
    if (!form.objective || form.objective.trim().length < 5) errs.objective = 'El objetivo debe tener al menos 5 caracteres'
    const dur = Number(form.duration)
    if (!dur || dur < 1) errs.duration = 'La duración debe ser un número mayor a 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditing(null); setForm(initialForm); setErrors({}); setShowModal(true)
  }

  const openEdit = (sport) => {
    setEditing(sport)
    setForm({ name: sport.name, objective: sport.objective, duration: sport.duration.toString() })
    setErrors({})
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, duration: Number(form.duration) }
      if (editing) {
        await updateSport(editing.id, payload)
        Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Deporte actualizado correctamente', timer: 1500, showConfirmButton: false })
      } else {
        await createSport(payload)
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Deporte creado correctamente', timer: 1500, showConfirmButton: false })
      }
      setShowModal(false)
      load()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al guardar' })
    } finally { setSaving(false) }
  }

  const handleDelete = (sport) => {
    Swal.fire({
      title: '¿Está seguro de eliminar este deporte?',
      text: `${sport.name} se eliminará permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSport(sport.id)
          Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Deporte eliminado correctamente', timer: 1500, showConfirmButton: false })
          load()
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error al eliminar' })
        }
      }
    })
  }

  const handleToggle = async (sport) => {
    const prevStatus = sport.status
    setSports((prev) => prev.map((s) => (s.id === sport.id ? { ...s, status: !prevStatus } : s)))
    try {
      await toggleSportStatus(sport.id, !prevStatus)
    } catch (err) {
      setSports((prev) => prev.map((s) => (s.id === sport.id ? { ...s, status: prevStatus } : s)))
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado' })
    }
  }

  return (
    <DashboardLayout>
      <Container fluid className="px-0">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--admin-color)' }}>Gestión de Deportes</h2>
            <p className="small-text mb-0">Administra los deportes ofrecidos por el club</p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <Button variant="outline-dark" size="sm" onClick={load}><FaSync className="me-1" /> Refrescar</Button>
            <Button className="btn-pink btn-sm" onClick={openCreate}><FaPlus className="me-1" /> Nuevo Deporte</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner variant="dark" /></div>
        ) : (
          <div className="list-card">
            <Table className="table-custom mb-0" size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th style={{ width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sports.length === 0 ? (
                  <tr><td colSpan={7} className="text-center small-text py-4">No hay deportes registrados</td></tr>
                ) : (
                  sports.map((s) => (
                    <tr key={s.id}>
                      <td className="small-text">{s.id}</td>
                      <td><strong>{s.name}</strong></td>
                      <td className="small-text">{s.objective}</td>
                      <td>{s.duration} min</td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`switch-${s.id}`}
                          label={s.status ? 'Activo' : 'Inactivo'}
                          checked={s.status}
                          onChange={() => handleToggle(s)}
                          style={{ color: s.status ? 'var(--coach-color)' : 'var(--text-muted)' }}
                        />
                      </td>
                      <td className="small-text">{formatDate(s.created_at)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="outline-dark" size="sm" onClick={() => openEdit(s)} title="Editar"><FaEdit /></Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s)} title="Eliminar"><FaTrash /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
        <Modal.Header closeButton><Modal.Title>{editing ? 'Editar Deporte' : 'Nuevo Deporte'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="py-2 small">
              {Object.values(errors).map((e, i) => <div key={i}>• {e}</div>)}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Nombre del deporte <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: CrossFit, Yoga, Spinning"
                isInvalid={!!errors.name}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small-text">Objetivo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                placeholder="Describe el objetivo principal del deporte"
                isInvalid={!!errors.objective}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small-text">Duración (minutos) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="Ej: 60"
                isInvalid={!!errors.duration}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button className="btn-pink btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : editing ? 'Guardar Cambios' : 'Crear Deporte'}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
