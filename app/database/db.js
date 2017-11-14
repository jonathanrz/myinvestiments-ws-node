import mongoose from "mongoose";

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
