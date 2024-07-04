



const router = require('express').Router();
const Products = require('../models/products/productModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;

    const existingProduct = await Products.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }

    const newProduct = new Products({
      name,
      description,
      price,
      category,
      availability
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message
    });
  }
});


router.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});


router.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, availability } = req.body;

    const existingProduct = await Products.findOne({ name });

    if (existingProduct && existingProduct._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      availability
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete a product by ID
router.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});


router.get('/api/products/search',authMiddleware, async (req, res) => {
  try {
    console.log("first",req.query)
    const { query } = req.query;
    console.log(query)
  
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query string is required' });
    }
   
    const product = await Products.find({
      name: { $regex: query, $options: 'i' },
    });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
