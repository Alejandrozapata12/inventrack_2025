// backend/middleware/errorMiddleware.js
const { sendError } = require('../utils/responseUtils');

function errorHandler(err, req, res, next) {
  console.error('Error no manejado:', err);
  sendError(res, 'Error interno del servidor', 500);
}

function notFoundHandler(req, res) {
  sendError(res, 'Ruta no encontrada', 404);
}

module.exports = {
  errorHandler,
  notFoundHandler
};