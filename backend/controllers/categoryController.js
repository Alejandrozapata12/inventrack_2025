// backend/controllers/categoryController.js
const categoryService = require('../services/categoryService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return sendError(res, 'Categoría no encontrada', 404);
    }
    
    sendSuccess(res, category);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createCategory(req, res) {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    sendSuccess(res, newCategory, 'Categoría creada exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    sendSuccess(res, updatedCategory, 'Categoría actualizada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    sendSuccess(res, null, 'Categoría eliminada exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};