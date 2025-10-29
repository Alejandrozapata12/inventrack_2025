// backend/controllers/settingController.js
const settingService = require('../services/settingService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getSettings(req, res) {
  try {
    const settings = await settingService.getSettings();
    sendSuccess(res, settings);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function updateSettings(req, res) {
  try {
    // Verificar que el usuario tenga permiso para actualizar configuraciones (solo admin)
    if (req.user.role !== 'admin') {
      return sendError(res, 'Acceso denegado. Solo administradores pueden actualizar configuraciones', 403);
    }
    
    const updatedSettings = await settingService.updateSettings(req.body);
    sendSuccess(res, updatedSettings, 'Configuración actualizada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getSettings,
  updateSettings
};