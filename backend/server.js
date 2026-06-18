require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'gorila-sportclub-secret-dev'
const DB_PATH = path.join(__dirname, 'db', 'users.json')

app.use(cors())
app.use(express.json())

// --- Persistencia JSON ---
function readUsers() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

// --- JWT middleware ---
function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }
  const users = readUsers()
  const user = users.find((u) => u.email === email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, user: payload })
})

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }
  if (!['User', 'Coach'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' })
  }
  const users = readUsers()
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'El email ya está registrado' })
  }
  const hashed = bcrypt.hashSync(password, 10)
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password: hashed,
    role
  }
  users.push(newUser)
  writeUsers(users)
  const payload = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  res.status(201).json({ token, user: payload })
})

// --- Profile ---
app.put('/api/profile', authenticate, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === req.user.id)
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' })

  if (currentPassword && newPassword) {
    if (!bcrypt.compareSync(currentPassword, users[idx].password)) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta' })
    }
    users[idx].password = bcrypt.hashSync(newPassword, 10)
  }
  if (name) users[idx].name = name
  if (email) {
    const existing = users.find((u) => u.email === email && u.id !== req.user.id)
    if (existing) return res.status(409).json({ error: 'El email ya está en uso' })
    users[idx].email = email
  }
  writeUsers(users)
  const payload = { id: users[idx].id, email: users[idx].email, name: users[idx].name, role: users[idx].role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, user: payload, message: 'Perfil actualizado correctamente' })
})

// --- Admin CRUD ---
app.get('/api/users', authenticate, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'No autorizado' })
  const users = readUsers()
  const safe = users.map(({ password, ...u }) => u)
  res.json(safe)
})

app.post('/api/users', authenticate, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'No autorizado' })
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }
  const users = readUsers()
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'El email ya existe' })
  }
  const hashed = bcrypt.hashSync(password, 10)
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password: hashed,
    role
  }
  users.push(newUser)
  writeUsers(users)
  const { password: _, ...safe } = newUser
  res.status(201).json(safe)
})

app.put('/api/users/:id', authenticate, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'No autorizado' })
  const { name, email, password, role } = req.body
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' })
  if (email) {
    const existing = users.find((u) => u.email === email && u.id !== users[idx].id)
    if (existing) return res.status(409).json({ error: 'El email ya está en uso' })
  }
  if (name) users[idx].name = name
  if (email) users[idx].email = email
  if (role) users[idx].role = role
  if (password) users[idx].password = bcrypt.hashSync(password, 10)
  writeUsers(users)
  const { password: _, ...safe } = users[idx]
  res.json(safe)
})

app.delete('/api/users/:id', authenticate, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'No autorizado' })
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' })
  const deleted = users.splice(idx, 1)
  writeUsers(users)
  const { password: _, ...safe } = deleted[0]
  res.json(safe)
})

// --- Coach endpoint: return non-Admin users ---
app.get('/api/students', authenticate, (req, res) => {
  if (req.user.role !== 'Coach') return res.status(403).json({ error: 'No autorizado' })
  const users = readUsers()
  const students = users.filter((u) => u.role !== 'Admin').map(({ password, ...u }) => u)
  res.json(students)
})

// --- Serve static files in production ---
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
