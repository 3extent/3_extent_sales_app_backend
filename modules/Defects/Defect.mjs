import moment from "moment";
import mongoose from "mongoose";


const defectSchema = new mongoose.Schema({
  name: String,
  question: String,
  description: String,
  image: String,
  thumbnailBase64:String,
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() },
  type: String
});

export default mongoose.model('Defect', defectSchema);
