import redis from "../lib/redis.js";
import Product from "../models/Products.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error:", error });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const cached = await redis.get("featured_products");

    if (cached) {
      console.log("Featured products fetched from cache", typeof cached === 'string' ? "cache is string" : "cache is object");
      return res.json(cached);
    }

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    console.log("Featured products fetched from database");
    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      { ex: 86400 }
    );
    console.log("Featured products cached in Redis");
    return res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try{
    const { name, description, image, price, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
        try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "products",
        });
        cloudinaryResponse = uploadResponse;
        } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Image upload failed", error });
        }
    }

    const product = await Product.create({
        name, 
        description, 
        image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,   
        price, 
        category, 
    })

    res.status(201).json({ message: "Product created successfully", product });
  }catch(error){
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error:", error  });
  }
}

export const deleteProduct = async (req, res) => {
  try{
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });

  }catch(error){
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error:", error  });
  }
}

export const getRecommendedProducts = async (req, res) => {
  try{
    const products = await Product.aggregate([
      { $sample: { size: 5 } },
      { $project: { name:1, description:1, image:1, price:1, category:1 } }
    ])
    res.json(products);
    console.log("Recommended products sent");
  }catch(error){
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Server error:", error  });
  }
}

export const getProductsByCategory = async (req, res) => {
  try{
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json({ products });
  }catch(error){
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error:", error  });
  } 
}

export const toggleFeaturedProduct = async (req, res) => {
  try{
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    await updateFeaturedProductsCache();
    res.json({ message: "Product featured status toggled", product });
  }catch(error){
    console.error("Error toggling featured status:", error);
    res.status(500).json({ message: "Server error:", error  });
  }
}

async function updateFeaturedProductsCache() {
	try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    try {
      await redis.set("featured_products", JSON.stringify(featuredProducts), { ex: 86400 });
    } catch (cacheErr) {
      console.warn("Failed to update featured products cache:", cacheErr && cacheErr.message ? cacheErr.message : cacheErr);
    }
	} catch (error) {
    console.log("error in update cache function", error);
	}
}