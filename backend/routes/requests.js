// backend/routes/requests.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas protegidas (empleados y admin)
router.get('/', authenticateToken, requestController.getAllRequests);
router.post('/', authenticateToken, requestController.createRequest);
router.get('/:id', authenticateToken, requestController.getRequestById);
router.put('/:id/status', authenticateToken, requestController.updateRequestStatus);
router.delete('/:id', authenticateToken, requestController.deleteRequest);

module.exports = router;