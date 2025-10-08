const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = new mongoose.Schema({
  name: String,
  contact_number: String,
  email_id: String,
  password: String,
  address: String,
  role: String,
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

module.exports = mongoose.model('User', userSchema);
