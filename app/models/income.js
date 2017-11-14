import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  investment: String,
  date: Date,
  quantity: Number,
  value: Number,
  bought: Number,
  gross: Number,
  ir: Number,
  fee: Number
});

incomeSchema.methods.yield = function(originalValue) {
  const result = this.value - originalValue;
  if (this.bought) return result - this.bought;
  return result;
};

incomeSchema.methods.boughtValue = function() {
  if (this.bought) return this.bought;
  return 0;
};

incomeSchema.methods.grossValue = function() {
  if (this.gross) return this.gross;
  return 0;
};

incomeSchema.methods.irValue = function() {
  if (this.ir) return this.ir;
  return 0;
};

incomeSchema.methods.feeValue = function() {
  if (this.fee) return this.fee;
  return 0;
};

export default mongoose.model("Income", incomeSchema);
