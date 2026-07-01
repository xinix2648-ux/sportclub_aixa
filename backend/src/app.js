const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const distPath = path.join(__dirname, '../..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      ok: true,
      message: 'API de usuarios funcionando.',
      docs: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
        users: 'GET /api/users',
        sports: 'GET /api/sports'
      }
    });
  });
}

app.use('/api', routes);

if (fs.existsSync(distPath)) {
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

module.exports = app;
