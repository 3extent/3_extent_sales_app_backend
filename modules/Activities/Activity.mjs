import moment from "moment";
import mongoose from "mongoose";


const activitySchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  final_price: { type: Number, default: 0 },
  add_on_amount: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  selected_ram_storage: String,
  selected_address: {
    pincode: Number,
    flat_no: String,
    area: String,
    land_mark: String,
    alternate_number: Number,
    type: { type: String }
  },
  // status: "String",
  status: {
    type: String,
    enum: [
      "PENDING",
      "ASSIGNED",
      "ACCEPTED",
      "REJECTED",
      "APPROVED_PENDING",
      "APPROVED"
    ],
    default: "PENDING"
  },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('Activity', activitySchema);
