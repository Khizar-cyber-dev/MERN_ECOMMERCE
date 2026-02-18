import Product from "../models/Products.js";
import User from '../models/Users.js';

export const createCart = async (req, res) => {
    try{
        const { productId } = req.body;
        const user = req.user;
        if (!user.cartItems) user.cartItems = [];

        const checkExistingCart = user.cartItems.find((item) => item.product && item.product.toString() === productId);

        if (checkExistingCart) {
            checkExistingCart.quantity += 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.status(201).json({ message: "Cart updated successfully", cart: user.cartItems });
        console.log("Cart updated successfully");
    }catch(error){
        console.error("Error creating cart:", error);
        res.status(500).json({ message: "Server error:", error  });
    }
}

export const clearCart = async (req, res) => {
    try{
        const user = req.user;
        const { productId } = req.body;

        if (!user.cartItems) user.cartItems = [];

        if(!productId){
            user.cartItems = [];
        }else{
            user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        }
        await user.save();
        res.json({ message: "Cart cleared successfully", cart: user.cartItems });
        console.log("Cart cleared successfully");
    }catch(error){
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Server error:", error  });
    }
}

export const updateQuantity = async (req, res) => {
    try{
        const user = req.user;
        const productId = req.params.id || req.body.productId;
        const { quantity } = req.body;

        if (!user.cartItems) user.cartItems = [];

        const cartItem = user.cartItems.find((item) => item.product && item.product.toString() === productId);

        if (cartItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            cartItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
      
    }catch(error){
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({ message: "Server error:", error  });
    }
}

export const getCart = async (req, res) => {
    try {
        const user = await req.user.populate({
            path: 'cartItems.product',
            options: { lean: true }
        });
        const cartItems = user.cartItems.map((item) => ({
        ...item.product,
        quantity: item.quantity
        }));

        res.json(cartItems);

    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}