// backend/controllers/requestController.js
const requestService = require('../services/requestService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllRequests(req, res) {
  try {
    const filters = {
      status: req.query.status,
      productId: req.query.productId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const requests = await requestService.getAllRequests(filters);
    sendSuccess(res, requests);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createRequest(req, res) {
  try {
    const newRequest = await requestService.createRequest(req.body);
    sendSuccess(res, newRequest, 'Solicitud enviada exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function getRequestById(req, res) {
  try {
    const { id } = req.params;
    const request = await requestService.getRequestById(id);
    
    if (!request) {
      return sendError(res, 'Solicitud no encontrada', 404);
    }
    
    sendSuccess(res, request);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Verificar que el usuario tenga permiso para actualizar el estado (solo admin)
    if (req.user.role !== 'admin') {
      return sendError(res, 'Acceso denegado. Solo administradores pueden actualizar el estado de solicitudes', 403);
    }
    
    const updatedRequest = await requestService.updateRequestStatus(id, status, req.user.id);
    sendSuccess(res, updatedRequest, `Solicitud ${status.toLowerCase()} exitosamente`);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteRequest(req, res) {
  try {
    const { id } = req.params;
    await requestService.deleteRequest(id);
    sendSuccess(res, null, 'Solicitud eliminada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllRequests,
  createRequest,
  getRequestById,
  updateRequestStatus,
  deleteRequest
};