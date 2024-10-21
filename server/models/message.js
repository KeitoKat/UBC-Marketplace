const mongoose = require('mongoose');

/**
 * Message schema for MongoDB database
 */
const messageSchema = mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  type: { type: String, required: true, default: 'text' },
  createdAt: { type: Date, required: true, default: Date.now },
});

/**
 * Transform the returned object to include an id field
 */
messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Message', messageSchema);
