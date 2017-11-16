import mongoose from "mongoose";
import bluebird from "bluebird";

mongoose.Promise = bluebird;

const uristring = process.env.MONGODB_URI;
const connectToDatabase = () => {
  mongoose.connect(uristring, err => {
    if (err) {
      console.log("ERROR connecting to: " + uristring + ". " + err);
    } else {
      console.log("Succeeded connected to: " + uristring);
    }
  });
};

export default connectToDatabase;
