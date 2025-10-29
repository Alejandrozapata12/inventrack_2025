// backend/controllers/authController.js
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function register(req, res) {
  try {
    const newUser = await authService.register(req.body);
    const { password_hash, ...userWithoutPassword } = newUser.toJSON(); // Excluir password_hash de la respuesta
    sendSuccess(res, userWithoutPassword, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    const { password_hash, ...userWithoutPassword } = user.toJSON(); // Excluir password_hash

    sendSuccess(res, { user: userWithoutPassword, token }, 'Inicio de sesión exitoso');
  } catch (error) {
    sendError(res, error.message, 401);
  }
}

async function getProfile(req, res) {
  try {
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, error.message, 404);
  }
}

async function updateProfile(req, res) {
  try {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);
    sendSuccess(res, updatedUser, 'Perfil actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};