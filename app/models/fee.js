import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  name: String,
  date: Date,
  holder: String,
  value: Number
});

export default mongoose.model("Fee", feeSchema);
