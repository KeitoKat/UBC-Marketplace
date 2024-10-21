const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Item = require('../models/item');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const Order = require('../models/order');

/**
 * GET /users
 * Response: users
 * Description: Get all users that are not archived
 */
router.get('/', async function (req, res, next) {
  // res.send('respond with a resource');
  try {
    const users = await User.find({ archived: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /users/:id
 * Query: id
 * Response: user
 * Description: Get user by id that is not archived
 */
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, mobile, password } = req.body;
  try {
    const updateData = { name, mobile };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    console.log(`user updated: ${JSON.stringify(updatedUser)}`);
    res.json(updatedUser);
  } catch (error) {
    console.error(`error updating: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /users/:id
 * Query: id
 * Response: user
 * Description: Get user by id that is not archived and populate items
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;

    await Item.deleteMany({ owner: userId });
    await Message.deleteMany({ sender: userId });
    await Conversation.deleteMany({ participants: userId });
    await Order.deleteMany({ $or: [{ buyer: userId }, { seller: userId }] });

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /users/:id/status
 * Query: id
 * Body: isArchived
 * Response: message
 * Description: Archive or recover user by id based on isArchived
 */
router.put('/:id/status', async (req, res, next) => {
  const { id } = req.params;
  const { isArchived } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isArchived },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'user not found' });
    }

    const statusMessage = isArchived
      ? 'User archived successfully'
      : 'User recovered successfully';
    res.status(200).json({ message: statusMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
