const express = require('express');
const Order = require('../models/order');
const Item = require('../models/item');
const User = require('../models/user');
const router = express.Router();

/**
 * GET /orders/buyer/:userId
 * Query: userId
 * Response: orders
 * Description: Get all orders for a buyer by userId
 */
router.get('/buyer/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.userId })
      .populate('item')
      .populate('buyer')
      .populate('seller');

    res.json(orders);
  } catch (error) {
    // console.error('failed to fetch buyer orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /orders/seller/:userId
 * Query: userId
 * Response: orders
 * Description: Get all orders for a seller by userId
 */
router.get('/seller/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.params.userId })
      .populate('item')
      .populate('buyer')
      .populate('seller');

    res.json(orders);
  } catch (error) {
    // console.error('failed to fetch seller orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /orders/:orderId
 * Query: orderId
 * Response: order
 * Description: Get order by orderId with populated item, buyer, and seller
 */
router.post('/', async (req, res) => {
  const { item, itemName, buyer, seller, status } = req.body;
  try {
    const newOrder = new Order({
      item,
      itemName,
      buyer,
      seller,
      status: status || 'pending',
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('error creating order:', error);
    res.status(500).json({ error: 'failed to create order' });
  }
});

/**
 * PATCH /orders/:orderId
 * Query: orderId
 * Body: status
 * Response: updated order
 * Description: Update order status by orderId and update item isArchived
 */
router.patch('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'order not found' });
    }

    const item = await Item.findById(updatedOrder.item);
    const user = await User.findById(updatedOrder.seller);

    if (!item || !user) {
      return res.status(404).json({ error: 'Item or user not found' });
    }

    if (status === 'completed') {
      await Item.findByIdAndUpdate(
        updatedOrder.item,
        { isArchived: true },
        { new: true },
      );
    } else {
      const userIsArchived = user.isArchived;
      await Item.findByIdAndUpdate(
        updatedOrder.item,
        { isArchived: userIsArchived ? true : false },
        { new: true },
      );
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('error updating order status:', error);
    res.status(500).json({ error: 'failed to update order status' });
  }
});

module.exports = router;
