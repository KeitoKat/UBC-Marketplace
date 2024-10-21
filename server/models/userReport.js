const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * UserReport schema for MongoDB database
 */
const UserReportSchema = new Schema(
  {
    reason: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('UserReport', UserReportSchema);
