const express = require('express');
const Item = require('../models/item');
const Order = require('../models/order');
const User = require('../models/user');
const analyzeContent = require('../utils/analyzeContent');
const router = express.Router();

/**
 * GET /items
 * Query: search, category, minPrice, maxPrice
 * Response: items
 * Description: Get all items that are not archived,
 * and match the search query, category, and price range
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const query = { isArchived: false };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice !== undefined) {
      query.price = { $gte: Number(minPrice) };
    } else if (maxPrice !== undefined) {
      query.price = { $lte: Number(maxPrice) };
    }

    const items = await Item.find(query).populate('owner');
    res.json(items);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: error.message });
  }
});

// Minimum length for description to be analyzed
const MIN_TEXT_LENGTH = 20;

/**
 * POST /items
 * Request Body: {name, description, category, condition, price, location, owner, image}
 * Response: savedItem
 * Description: Sanitize and save a new item
 */
router.post('/', async (req, res) => {
  const {
    name,
    description,
    category,
    condition,
    price,
    location,
    owner,
    image,
  } = req.body;

  // Check if the description is too short
  if (
    name.length + description.length + category.length + location.length <
    MIN_TEXT_LENGTH
  ) {
    return res.status(400).json({
      message: 'Your need more detailed description to post your item.',
    });
  }

  try {
    const containsSensitiveContent = await analyzeContent(
      name + description + category + location,
    );

    if (containsSensitiveContent) {
      return res.status(400).json({
        message: 'This post might include sensitive content, try again later.',
      });
    }

    const item = new Item({
      name,
      description,
      category,
      condition,
      price,
      location,
      owner,
      image,
    });
    const savedItem = await item.save();

    res.json(savedItem);
  } catch (error) {
    console.error('Error saving item:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

/**
 * DELETE /items/:id
 * Response: item
 * Description: Archive an item by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true },
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /items/:id
 * Request Body: {name, description, category, condition, price, location, owner, image}
 * Response: item
 * Description: Update an item by ID
 */
router.put('/:id', async (req, res) => {
  const body = req.body;
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /items/deleteMany
 * Request Body: {ids}
 * Response: {ids}
 * Description: Archive multiple items by their IDs
 */
router.post('/deleteMany', async (req, res) => {
  const { ids } = req.body;
  try {
    await Item.updateMany({ _id: { $in: ids } }, { isArchived: true });
    res.json({ ids });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /items/:id/status
 * Request Body: {isArchived}
 * Response: {message, item}
 * Description: Update an item's status by ID
 */
router.put('/:id/status', async (req, res) => {
  const itemId = req.params.id;
  const { isArchived } = req.body;
  try {
    const item = await Item.findByIdAndUpdate(
      itemId,
      { isArchived },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await Item.updateMany({ owner: item.owner }, { isArchived });

    const statusMessage = isArchived ? 'archived' : 'recovered';
    res.status(200).json({ message: `Item ${statusMessage}`, item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
