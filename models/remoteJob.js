import mongoose from "mongoose";

const remoteJobSchema = new mongoose.Schema({
  nomPrenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: String,
    required: true,
  },
  dateFin: {
    type: String,
    required: true,
  },
  dateSoumission: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const RemoteJob = mongoose.model("RemoteJob", remoteJobSchema);

export default RemoteJob;
