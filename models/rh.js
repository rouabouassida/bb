import mongoose from "mongoose";

const rhSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Rh = mongoose.model("Rh", rhSchema);

export default Rh;
