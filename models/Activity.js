const mongoose = require('mongoose');
const moment = require('moment');

const activitySchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  final_price: String,
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

module.exports = mongoose.model('Activity', activitySchema);
