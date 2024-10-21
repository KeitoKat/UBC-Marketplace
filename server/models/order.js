const mongoose = require('mongoose');

/**
 * Order schema for MongoDB database
 */
const orderSchema = mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: { type: String, default: 'pending', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
