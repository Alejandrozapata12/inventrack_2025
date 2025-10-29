// backend/controllers/productController.js
const productService = require('../services/productService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

async function getAllProducts(req, res) {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      minStock: req.query.minStock ? parseInt(req.query.minStock) : undefined,
      maxStock: req.query.maxStock ? parseInt(req.query.maxStock) : undefined,
      search: req.query.search
    };
    
    const products = await productService.getAllProducts(filters);
    sendSuccess(res, products);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return sendError(res, 'Producto no encontrado', 404);
    }
    
    sendSuccess(res, product);
  } catch (error) {
    sendError(res, error.message, 500);
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await productService.createProduct(req.body);
    sendSuccess(res, newProduct, 'Producto creado exitosamente', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    sendSuccess(res, updatedProduct, 'Producto actualizado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    sendSuccess(res, null, 'Producto eliminado exitosamente');
  } catch (error) {
    sendError(res, error.message, 400);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};