// backend/routes/returns.js
const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas protegidas (empleados y admin)
router.get('/', authenticateToken, returnController.getAllReturns);
router.post('/', authenticateToken, returnController.createReturn);
router.get('/:id', authenticateToken, returnController.getReturnById);
router.put('/:id', authenticateToken, returnController.updateReturn);
router.delete('/:id', authenticateToken, returnController.deleteReturn);

module.exports = router;