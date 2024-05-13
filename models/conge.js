import mongoose from "mongoose";
import moment from "moment";

const { Schema } = mongoose;

const formatDate1 = () => {
  const now = new Date();
  return moment(now).format("DD/MM/YYYY");
};

// Définition du schéma pour les demandes de congé
const congeSchema = new Schema({
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
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    default: formatDate1,
  },
  updatedAt: {
    type: String,
    default: formatDate1,
  },
});

congeSchema.pre("findOneAndUpdate", async function (next) {
  this.updatedAt = formatDate1;
  next();
});

// Création du modèle pour les demandes de congé
const Conge = mongoose.model("Conge", congeSchema);

export default Conge;
