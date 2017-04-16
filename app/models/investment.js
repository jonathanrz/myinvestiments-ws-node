var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InvestmentSchema   = new Schema({
    name: String,
    type: String,
    holder: String
});

module.exports = mongoose.model('Investment', InvestmentSchema);
