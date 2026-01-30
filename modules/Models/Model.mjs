import moment from "moment";
import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: String,
  image: String,
  ramStorageComb: [{ ramStorage: String, price: String }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  enquiryQuestions: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  bodyDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  brokenScratchDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  screenDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  scrachesBodyDefect: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  devicePanelMissing: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  functionalDefects: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  availableAccessories: [{ defect: { type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }, price: String }],
  created_at: { type: Number, default: moment.utc().valueOf() },
  updated_at: { type: Number, default: moment.utc().valueOf() }
});

export default mongoose.model('Model', modelSchema);
