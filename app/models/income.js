var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var incomeSchema = new Schema({
    investment: String,
    date: Date,
    quantity: Number,
    value: Number,
    bought: Number
});

incomeSchema.methods.yield = function(originalValue) {
  result = value - lastValue;
  if(bought)
    result -= bought;
  return result;
};

module.exports = mongoose.model('Income', incomeSchema);
