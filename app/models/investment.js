var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InvestmentSchema = new Schema({
    name: String,
    type: String,
    holder: String,
    due_date: Date
});

module.exports = mongoose.model('Investment', InvestmentSchema);
