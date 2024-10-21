const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Conversation schema for MongoDB database
 */
const conversationSchema = mongoose.Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  createdAt: { type: Date, required: true, default: Date.now },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
  lastUpdated: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false },
});
/**
 * Transform the returned object to include an id field
 */
conversationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);
