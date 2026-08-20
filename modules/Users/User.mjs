import moment from "moment";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  contact_number: String,
  email_id: String,
   firstName:String, 
   lastName: String,
   

  // 🔐 OTP fields
  otp: String,
  otp_expires_at: Number,

  address: [
    {
      pincode: Number,
      flat_no: String,
      area: String,
      land_mark: String,
      alternate_number: Number,
      type: { type: String },
      city: String,
      state: String,
    }
  ],

  role: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('User', userSchema);
