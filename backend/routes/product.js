import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/productController.js';
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", protectRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;