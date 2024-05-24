import RemoteJob from "../models/remoteJob.js"; // Correction du chemin d'importation
import User from "../models/user.js";
import { sendNewRemote } from "../helpers/sendEmail.js";
import moment from "moment";

function validateDates(dateDebut, dateFin) {
  return (
    moment(dateDebut, "DD/MM/YYYY", true).isValid() &&
    moment(dateFin, "DD/MM/YYYY", true).isValid()
  );
}

const submitRemoteJob = async (req, res) => {
  try {
    const { nomPrenom, email, dateDebut, dateFin } = req.body;
    if (!nomPrenom || !email || !dateDebut || !dateFin) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }

    const userLoggedIn = await User.findOne({ email: email });
    if (!userLoggedIn || !userLoggedIn.fullname || userLoggedIn.fullname.trim().toLowerCase() !== nomPrenom.trim().toLowerCase()) {
      return res.status(401).json({ message: "Utilisateur non autorisé ou nom/prénom incorrect." });
    }

    const existingRemoteJob = await RemoteJob.findOne({ email: email, nomPrenom: nomPrenom });
    if (existingRemoteJob) {
      return res.status(409).json({ message: "Une demande d'emploi à distance existe déjà pour cet utilisateur." });
    }

    if (!validateDates(dateDebut, dateFin)) {
      return res
        .status(400)
        .json({ message: "Les dates ne sont pas valides." });
    }

    if (
      moment(dateDebut, "DD/MM/YYYY").isAfter(moment(dateFin, "DD/MM/YYYY"))
    ) {
      return res
        .status(400)
        .json({
          message: "La date de début doit être antérieure à la date de fin.",
        });
    }

    const remoteJob = new RemoteJob({
      nomPrenom,
      email,
      dateDebut,
      dateFin,
    });

    await remoteJob.save();

    res.status(201).json({ message: "Demande d'emploi à distance soumise avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la soumission de la demande d'emploi à distance." });
  }
};
const getRemoteData = async (req, res) => {
  try {
    // Récupérer toutes les demandes de congé depuis la base de données
    const remoteData = await RemoteJob.find();

    // Vérifier si des données ont été trouvées
    if (!remoteData) {
      return res
        .status(404)
        .json({ message: "Aucune donnée de travaille a distance trouvée." });
    }
    // Envoyer les données de congé en réponse
    res.status(200).json(remoteData);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de travail à distance :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données de travail à distance." });
  }
};
const verifierRemote = async (req, res) => {
  try {
    const { email, nomPrenom, date } = req.body;
    console.log(email);
    const updated = await RemoteJob.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    console.log(updated);
    /* envoyer email */
    sendNewRemote(nomPrenom, email, date);

    res.status(200).json({ message: " remote confirmé " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occcured" });
  }
};

export { getRemoteData,
  submitRemoteJob,verifierRemote};
