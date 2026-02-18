import express from 'express';
import { getProfile, login, logOut, refreshToken, register } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logOut);
router.post('/refresh-token', refreshToken);
router.get('/profile', protectRoute, getProfile);

export default router;