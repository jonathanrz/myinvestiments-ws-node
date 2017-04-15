var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InvestmentSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Investment', InvestmentSchema);
