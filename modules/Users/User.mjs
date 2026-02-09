import moment from "moment";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  contact_number: String,
  email_id: String,

  // 🔐 OTP fields
  otp: String,
  otp_expires_at: Number,

  address: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('User', userSchema);
