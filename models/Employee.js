import mongoose from "mongoose";
// Fonction pour formater la date au format "jj/mm/aaaa"
const formatDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

// Fonction pour formater l'heure au format "hh:mm:ss"
const formatTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
// Schéma pour une entrée quotidienne
const entrySchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  entryTime: {
    type: String,
    required: false,
    default: formatTime, // Utilisation de la fonction comme valeur par défaut
  },
  exitTime: {
    type: String,
    required: false,
    default: formatTime, // Utilisation de la fonction comme valeur par défaut
  },
  hoursWorked: {
    type: String,
    required: true,
    default: "00:00:00", // Valeur par défaut pour les heures travaillées
  },
  workMode: {
    type: String,
    required: false,
  },
});

// Schéma pour les entrées quotidiennes
const dailyEntrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  entries: [entrySchema], // Tableau d'entrées pour chaque jour
});

// Modèle pour les employés
const Employee = mongoose.model("Employee", dailyEntrySchema);

export default Employee;