import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  holder: String,
  due_date: Date
});

investmentSchema.methods.toSimpleObject = function() {
  return {
    _id: this._id,
    name: this.name,
    type: this.type,
    holder: this.holder,
    due_date: this.due_date
  };
};

export default mongoose.model("Investment", investmentSchema);
