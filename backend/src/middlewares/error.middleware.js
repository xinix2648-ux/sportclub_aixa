const { fail } = require('../utils/api-response');

function notFound(req, res) {
  return fail(res, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404);
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    ok: false,
    message: err.message || 'Error interno del servidor.',
    errors: err.details || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = {
  notFound,
  errorHandler
};
