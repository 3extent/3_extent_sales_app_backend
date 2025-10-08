const mongoose = require('mongoose');
const moment = require('moment');

const brandSchema = new mongoose.Schema({
  name: String,
  image: String,
  possibleRamStorageComb: [String],
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

module.exports = mongoose.model('Brand', brandSchema);
