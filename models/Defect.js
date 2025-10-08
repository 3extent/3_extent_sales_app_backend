const mongoose = require('mongoose');
const moment = require('moment');

const defectSchema = new mongoose.Schema({
  name: String,
  image:String,
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

module.exports = mongoose.model('Defect', defectSchema);
