import api from './api'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function login(email, password) {
  return api.post('/auth/login', { email, password }).then((res) => {
    const { token, user } = res.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  })
}

export function register(data) {
  return api.post('/auth/register', data).then((res) => {
    const { token, user } = res.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  })
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function hasRole(role) {
  const user = getUser()
  return user && user.role === role
}
