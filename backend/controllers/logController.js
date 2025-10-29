// backend/controllers/logController.js
const logService = require('../services/logService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllLogs(req, res) {
  try {
    const filters = {
      userId: req.query.userId,
      actionType: req.query.actionType,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const logs = await logService.getAllLogs(filters);
    sendSuccess(res, logs);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function getLogById(req, res) {
  try {
    const { id } = req.params;
    const log = await logService.getLogById(id);
    
    if (!log) {
      return sendError(res, 'Registro no encontrado', 404);
    }
    
    sendSuccess(res, log);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createLog(req, res) {
  try {
    const newLog = await logService.createLog(req.body);
    sendSuccess(res, newLog, 'Registro creado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function updateLog(req, res) {
  try {
    const { id } = req.params;
    const updatedLog = await logService.updateLog(id, req.body);
    sendSuccess(res, updatedLog, 'Registro actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteLog(req, res) {
  try {
    const { id } = req.params;
    await logService.deleteLog(id);
    sendSuccess(res, null, 'Registro eliminado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog
};