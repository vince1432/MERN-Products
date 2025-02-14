import { addOneCache, getCache, removeOneCache, setCache, updateOneCache } from "../helpers/Cache.js";
import Product from "../models/product.model.js";
import mongoose from 'mongoose';

export const getProducts = async (req, res) => {
    try {
      
      let products = await getCache("products");
      
      if(!products) {
        products = await Product.find({});
        setCache("products", products);
      }

      return res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;

    if(!product.name || !product.price || !product.image) {
        return res.status(400).json({success: false, message: "Please provide all fields"});
    }

    const newProduct = new Product(product);  

    try {
        await newProduct.save();
        addOneCache("products", newProduct);
        return res.status(201).json({success: true, data: newProduct, message: "Product created successfully."});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server error"});
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if(!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product,{ new: true});  
        updateOneCache("products", id, updatedProduct);
        return res.status(200).json({success: true, data: updatedProduct, message: "Product update successfully."}); 
    } catch (error) {
        return res.status(500).json({success: false, message: error.message}); 
    }
    
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, message: "Invalid ID" });
    }

    try {
      await Product.findByIdAndDelete(id);
      removeOneCache("products", id);

      return res.status(200).json({success: true, message: "Product deleted successfuly"});
    } catch (error) {
      return res.status(500).json({success: false, message: error.message});
    }
}