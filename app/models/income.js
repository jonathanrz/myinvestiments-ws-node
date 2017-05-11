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
    return result - this.bought;
  return result;
};

incomeSchema.methods.boughtValue = function() {
  if(this.bought)
    return this.bought;
  return 0;
};

module.exports = mongoose.model('Income', incomeSchema);
