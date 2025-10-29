// backend/routes/movements.js
const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas protegidas (empleados y admin)
router.get('/', authenticateToken, movementController.getAllMovements);
router.post('/', authenticateToken, movementController.createMovement);
router.get('/:id', authenticateToken, movementController.getMovementById);
router.put('/:id', authenticateToken, movementController.updateMovement);
router.delete('/:id', authenticateToken, movementController.deleteMovement);

module.exports = router;