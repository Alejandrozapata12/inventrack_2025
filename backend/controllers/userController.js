// backend/controllers/userController.js
const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, users);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      return sendError(res, 'Usuario no encontrado', 404);
    }
    
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createUser(req, res) {
  try {
    const newUser = await userService.createUser(req.body);
    sendSuccess(res, newUser, 'Usuario creado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    sendSuccess(res, updatedUser, 'Usuario actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    sendSuccess(res, null, 'Usuario eliminado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};