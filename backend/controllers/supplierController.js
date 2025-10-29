// backend/controllers/supplierController.js
const supplierService = require('../services/supplierService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllSuppliers(req, res) {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    sendSuccess(res, suppliers);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function getSupplierById(req, res) {
  try {
    const { id } = req.params;
    const supplier = await supplierService.getSupplierById(id);
    
    if (!supplier) {
      return sendError(res, 'Proveedor no encontrado', 404);
    }
    
    sendSuccess(res, supplier);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createSupplier(req, res) {
  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    sendSuccess(res, newSupplier, 'Proveedor creado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function updateSupplier(req, res) {
  try {
    const { id } = req.params;
    const updatedSupplier = await supplierService.updateSupplier(id, req.body);
    sendSuccess(res, updatedSupplier, 'Proveedor actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;
    await supplierService.deleteSupplier(id);
    sendSuccess(res, null, 'Proveedor eliminado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};