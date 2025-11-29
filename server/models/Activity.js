import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },       
  metric: { type: String },                         
  value: { type: Number },                          
  duration: { type: Number, required: true },       
  date: { type: Date, default: new Date() }
});

export default mongoose.model("Activity", activitySchema);
