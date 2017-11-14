import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  holder: String,
  due_date: Date
});

export default mongoose.model("Investment", InvestmentSchema);
