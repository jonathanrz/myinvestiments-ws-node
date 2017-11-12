var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
  investment: String,
  date: Date,
  quantity: Number,
  value: Number,
  bought: Number,
  gross: Number,
  ir: Number,
  tax: Number
});

incomeSchema.methods.yield = function(originalValue) {
  result = this.value - originalValue;
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

incomeSchema.methods.taxValue = function() {
  if (this.tax) return this.tax;
  return 0;
};

incomeSchema.methods.irValue = function() {
  if (this.ir) return this.ir;
  return 0;
};

module.exports = mongoose.model("Income", incomeSchema);
