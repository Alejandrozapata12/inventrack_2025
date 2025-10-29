// backend/routes/suppliers.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (solo lectura para empleados)
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, requireAdmin, supplierController.createSupplier);
router.put('/:id', authenticateToken, requireAdmin, supplierController.updateSupplier);
router.delete('/:id', authenticateToken, requireAdmin, supplierController.deleteSupplier);

module.exports = router;