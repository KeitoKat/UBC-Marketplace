const mongoose = require('mongoose');

/**
 * Item schema for MongoDB database
 */
const itemSchema = mongoose.Schema({
  image: { type: [String], required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isArchived: { type: Boolean, default: false },
});

/**
 * Transform the returned object to include an id field
 */
itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Item', itemSchema);
