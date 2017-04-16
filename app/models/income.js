var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IncomeSchema   = new Schema({
    investment: String,
    date: Date,
    quantity: Number,
    value: Number
});

module.exports = mongoose.model('Income', IncomeSchema);
