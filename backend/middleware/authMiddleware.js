// backend/middleware/authMiddleware.js
const { verifyToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/responseUtils');
const db = require('../models');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendError(res, 'Token de acceso requerido', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 'Token inválido o expirado', 403);
    }

    // Buscar usuario en la base de datos
    const user = await db.User.findByPk(decoded.userId);
    if (!user) {
      return sendError(res, 'Usuario no encontrado', 401);
    }

    // Adjuntar usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return sendError(res, 'Acceso denegado. Se requiere rol de administrador', 403);
  }
  next();
}

function requireEmployee(req, res, next) {
  if (req.user.role !== 'employee') {
    return sendError(res, 'Acceso denegado. Se requiere rol de empleado', 403);
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireEmployee
};