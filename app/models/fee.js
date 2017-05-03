var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var feeSchema = new Schema({
    name: String,
    date: Date,
    holder: String
});

module.exports = mongoose.model('Fee', feeSchema);
