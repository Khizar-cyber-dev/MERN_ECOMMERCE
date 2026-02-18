import { Router } from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getCoupon, validateCoupon } from '../controllers/couponsController.js';

const router = Router();

router.get('/', protectRoute, getCoupon);
router.post('/validate', protectRoute, validateCoupon);
export default router;