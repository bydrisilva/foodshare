const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rotas públicas (Não precisam de token)
router.post('/cadastro', authController.cadastro);
router.post('/login', authController.login);

// Rotas protegidas (Precisam do authMiddleware)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
