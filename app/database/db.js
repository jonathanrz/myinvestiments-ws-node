var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var uristring = process.env.MONGODB_URI;
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});
