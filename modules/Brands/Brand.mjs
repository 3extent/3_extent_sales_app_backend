import moment from "moment";
import mongoose from "mongoose";


const brandSchema = new mongoose.Schema({
  name: String,
  image: String,
  possibleRamStorageComb: [String],
  defects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('Brand', brandSchema);
