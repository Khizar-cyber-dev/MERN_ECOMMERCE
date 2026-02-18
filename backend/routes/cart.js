import express from "express";
import { clearCart, createCart, getCart, updateQuantity } from "../controllers/cartController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, createCart);
router.delete("/", protectRoute, clearCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;