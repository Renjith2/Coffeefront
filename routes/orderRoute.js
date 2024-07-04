const router = require('express').Router();
const Order = require('../models/orders/orderModel'); // Assuming you have an Order model
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { customerName, productsOrdered, quantity, totalPrice, orderDate,orderStatus } = req.body;

    const newOrder = new Order({
      customerName,
      productsOrdered,
      quantity,
      totalPrice,
      orderDate,
      orderStatus
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: savedOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
});

router.get('/api/orders', authMiddleware, async (req, res) => {
    try {
      const products = await Order.find();
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



  
  router.put('/api/orders/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order',
        error: error.message,
      });
    }
  });
 
  

  router.delete('/api/orders/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedOrder = await Order.findByIdAndDelete(id);
  
      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
        data: deletedOrder,
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete order',
        error: error.message,
      });
    }
  });


  router.get('/api/orders/search',authMiddleware, async (req, res) => {
    try {
      const { q } = req.query;
  
      if (!q) {
        return res.status(400).json({ success: false, message: 'Query string is required' });
      }
  
      // Search orders based on customer name
      const orders = await Order.find({
        productsOrdered: { $regex: q, $options: 'i' },
      });
  
      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('Error searching orders:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

module.exports = router;
