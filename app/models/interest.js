var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var interestSchema = new Schema({
    name: String,
    date: Date,
    holder: String,
    gross_value: Number,
    ir_value: Number
});

interestSchema.methods.net_value = function() {
  return this.gross_value - this.ir_value;
};

module.exports = mongoose.model('Interest', interestSchema);
