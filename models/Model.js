const mongoose = require('mongoose');
const moment = require('moment');

const modelSchema = new mongoose.Schema({
  name: String,
  image: String,
  ramStorageComb: [{ ramStorage: String, price: String }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },

  enquiryQuestions: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],

  bodyDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  brokenScratchDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  screenDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  scarctchesBodyDefect: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  devicePanelMissing: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],


  functionalDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],

  availableAccessories: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],



  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

module.exports = mongoose.model('Model', modelSchema);
