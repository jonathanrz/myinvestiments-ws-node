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
  result = this.value - originalValue;
  if(this.bought)
    result -= this.bought;
  return result;
};

module.exports = mongoose.model('Income', incomeSchema);
