// backend/controllers/movementController.js
const movementService = require('../services/movementService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllMovements(req, res) {
  try {
    const filters = {
      type: req.query.type,
      productId: req.query.productId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const movements = await movementService.getAllMovements(filters);
    sendSuccess(res, movements);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createMovement(req, res) {
  try {
    const newMovement = await movementService.createMovement(req.body);
    sendSuccess(res, newMovement, 'Movimiento registrado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function getMovementById(req, res) {
  try {
    const { id } = req.params;
    const movement = await movementService.getMovementById(id);
    
    if (!movement) {
      return sendError(res, 'Movimiento no encontrado', 404);
    }
    
    sendSuccess(res, movement);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function updateMovement(req, res) {
  try {
    const { id } = req.params;
    const updatedMovement = await movementService.updateMovement(id, req.body);
    sendSuccess(res, updatedMovement, 'Movimiento actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteMovement(req, res) {
  try {
    const { id } = req.params;
    await movementService.deleteMovement(id);
    sendSuccess(res, null, 'Movimiento eliminado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllMovements,
  createMovement,
  getMovementById,
  updateMovement,
  deleteMovement
};