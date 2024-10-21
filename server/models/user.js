const mongoose = require('mongoose');

/**
 * User schema for MongoDB database
 */
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  isAdmin: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
