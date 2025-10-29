// backend/controllers/returnController.js
const returnService = require('../services/returnService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllReturns(req, res) {
  try {
    const filters = {
      productId: req.query.productId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const returns = await returnService.getAllReturns(filters);
    sendSuccess(res, returns);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createReturn(req, res) {
  try {
    const newReturn = await returnService.createReturn(req.body);
    sendSuccess(res, newReturn, 'Devolución registrada exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function getReturnById(req, res) {
  try {
    const { id } = req.params;
    const returnRecord = await returnService.getReturnById(id);
    
    if (!returnRecord) {
      return sendError(res, 'Devolución no encontrada', 404);
    }
    
    sendSuccess(res, returnRecord);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function updateReturn(req, res) {
  try {
    const { id } = req.params;
    const updatedReturn = await returnService.updateReturn(id, req.body);
    sendSuccess(res, updatedReturn, 'Devolución actualizada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteReturn(req, res) {
  try {
    const { id } = req.params;
    await returnService.deleteReturn(id);
    sendSuccess(res, null, 'Devolución eliminada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllReturns,
  createReturn,
  getReturnById,
  updateReturn,
  deleteReturn
};