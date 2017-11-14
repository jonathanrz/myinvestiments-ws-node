import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
  name: String,
  date: Date,
  holder: String,
  gross_value: Number,
  ir_value: Number
});

interestSchema.methods.net_value = function() {
  return this.gross_value - this.ir_value;
};

export default mongoose.model("Interest", interestSchema);
