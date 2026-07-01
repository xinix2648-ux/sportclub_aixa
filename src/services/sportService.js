import api from './api'

export function listSports() {
  return api.get('/sports').then((res) => res.data.data || [])
}

export function getSport(id) {
  return api.get(`/sports/${id}`).then((res) => res.data.data)
}

export function createSport(data) {
  return api.post('/sports', data).then((res) => res.data.data)
}

export function updateSport(id, data) {
  return api.put(`/sports/${id}`, data).then((res) => res.data.data)
}

export function deleteSport(id) {
  return api.delete(`/sports/${id}`).then((res) => res.data)
}

export function toggleSportStatus(id, status) {
  return api.patch(`/sports/${id}/status`, { status }).then((res) => res.data.data)
}
