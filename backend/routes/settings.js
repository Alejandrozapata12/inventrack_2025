// backend/routes/settings.js
const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas protegidas (empleados y admin)
router.get('/', authenticateToken, settingController.getSettings);
router.put('/', authenticateToken, settingController.updateSettings);

module.exports = router;