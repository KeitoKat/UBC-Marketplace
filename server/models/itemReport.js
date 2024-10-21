const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ItemReport schema for MongoDB database
 */
const ItemReportSchema = new Schema(
  {
    reason: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedItem: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ItemReport', ItemReportSchema);
