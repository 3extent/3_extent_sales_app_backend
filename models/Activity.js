const mongoose = require('mongoose');
const moment = require('moment');

const activitySchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  finalPrice: String,
});

module.exports = mongoose.model('Activity', activitySchema);
