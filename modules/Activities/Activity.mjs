import moment from "moment";
import mongoose from "mongoose";


const activitySchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  final_price: String,
  add_on_amount: String,
  total_amount: String,
  selected_ram_storage: String,
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('Activity', activitySchema);
