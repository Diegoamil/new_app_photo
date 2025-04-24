const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/activate/:token', userController.activateAccount);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Rotas protegidas (requerem autenticação)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Rotas de administração de usuários (protegidas)
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.put('/:id/status', authMiddleware, userController.toggleUserStatus);
router.put('/:id/role', authMiddleware, userController.changeUserRole);

module.exports = router;
