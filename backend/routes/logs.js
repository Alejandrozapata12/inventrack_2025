// backend/routes/logs.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas (solo admin)
router.get('/', authenticateToken, requireAdmin, logController.getAllLogs);
router.get('/:id', authenticateToken, requireAdmin, logController.getLogById);
router.post('/', authenticateToken, requireAdmin, logController.createLog);
router.put('/:id', authenticateToken, requireAdmin, logController.updateLog);
router.delete('/:id', authenticateToken, requireAdmin, logController.deleteLog);

module.exports = router;