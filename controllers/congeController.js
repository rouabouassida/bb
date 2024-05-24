import Conge from "../models/conge.js";
import User from "../models/user.js";
import moment from "moment";
import Employee from "../models/Employee.js";
import { sendNewConge } from "../helpers/sendEmail.js";

// Fonction pour formater la date au format "jj/mm/aaaa"
const formatDate = (now) => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

function secondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
}

function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function isBelowMinimumHours(totalTime, minimumHoursWorked) {
  const totalSeconds = timeToSeconds(totalTime);
  const minimumSeconds = timeToSeconds(minimumHoursWorked);
  return totalSeconds < minimumSeconds;
}

const createConge = async (req, res) => {
  const minimumHoursWorked = "00:00:20";
  try {
    const { email, dateDebut, dateFin ,typeConge} = req.body;
    if (!email || !dateDebut || !dateFin || !typeConge) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }

    const userLoggedIn = await User.findOne({ email: email });

    if (!userLoggedIn) {
      return res.status(401).json({ message: "Utilisateur non autorisé." });
    }

    if (!validateDates(dateDebut, dateFin)) {
      return res
        .status(400)
        .json({ message: "Les dates ne sont pas valides." });
    }

    if (
      moment(dateDebut, "DD/MM/YYYY").isAfter(moment(dateFin, "DD/MM/YYYY"))
    ) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin.",
      });
    }

    // Vérification de l'existence d'une demande de congé précédente
    const existingConge = await Conge.findOne({ email: email });
    if (existingConge) {
      return res.status(409).json({
        message: "Une demande de congé existe déjà pour cet utilisateur.",
      });
    }

    const nbrConges = await Conge.countDocuments({
      $and: [
        { dateDebut: { $gte: dateDebut } },
        { dateFin: { $lte: dateFin } },
      ],
    });

    console.log("nbrConges", nbrConges);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const employee = await Employee.aggregate([
      {
        $match: {
          "entries.fullname": userLoggedIn.fullname,
          $expr: {
            $gte: [
              { $dateFromString: { dateString: "$date", format: "%d/%m/%Y" } },
              threeMonthsAgo,
            ],
          },
        },
      },
      { $unwind: "$entries" },
      { $match: { "entries.fullname": userLoggedIn.fullname } },
    ]);

    if (employee.length == 0) {
      return res.status(404).json({ message: "Employé n'existe pas." });
    }

    const totalSeconds = employee
      .flatMap((record) => record.entries)
      .map((entry) => timeToSeconds(entry.hoursWorked))
      .reduce((acc, seconds) => acc + seconds, 0);

    const totalTime = secondsToTime(totalSeconds);

    console.log(`Total hours worked: ${totalTime}`);

    // Assuming the employee can take a maximum of 5 conges
    if (nbrConges > 5 || isBelowMinimumHours(totalTime, minimumHoursWorked)) {
      return res.status(400).json({
        message:
          "Vous n'êtes pas autorisé à prendre un congé pour cette période.",
      });
    }

    const conge = new Conge({
      nomPrenom: userLoggedIn.fullname,
      email,
      dateDebut,
      dateFin,
      hoursWorked: totalTime,
      typeConge
    });

    await conge.save();

    res.status(201).json({ message: "Demande de congé créée avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la demande de congé." });
  }
};

const modifierConge = async (req, res) => {
  try {
    const { email, nomPrenom, NVdateDebut, NVdateFin } = req.body;

    // Vérifier si tous les champs nécessaires sont présents
    if (!nomPrenom || !email || !NVdateDebut || !NVdateFin) {
      return res.status(404).json({ message: "Tous les champs sont requis !" });
    }

    // Trouver l'utilisateur connecté pour vérifier son autorisation
    const userLoggedIn = await User.findOne({ email: email });
    if (
      !userLoggedIn ||
      userLoggedIn.fullname.trim().toLowerCase() !==
        nomPrenom.trim().toLowerCase()
    ) {
      return res.status(401).json({ message: "Utilisateur non autorisé." });
    }

    // Vérifier la validité des nouvelles dates
    if (!validateDates(NVdateDebut, NVdateFin)) {
      return res
        .status(400)
        .json({ message: "Les dates ne sont pas valides." });
    }

    // Vérifier que la nouvelle date de début est avant la nouvelle date de fin
    if (
      moment(NVdateDebut, "DD/MM/YYYY").isAfter(moment(NVdateFin, "DD/MM/YYYY"))
    ) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin.",
      });
    }

    // Rechercher le congé existant avec le nom, prénom et email
    const congeExistant = await Conge.findOne({
      email: email,
      nomPrenom: nomPrenom,
    });

    // Si aucun congé correspondant n'est trouvé
    if (!congeExistant) {
      return res
        .status(404)
        .json({ message: "Aucun congé correspondant trouvé." });
    }

    // Si un congé correspondant est trouvé, procéder à la mise à jour des dates
    await Conge.findOneAndUpdate(
      { email: email, nomPrenom: nomPrenom },
      { dateDebut: NVdateDebut, dateFin: NVdateFin }
    );

    res.status(200).json({ message: "Congé modifié avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification du congé." });
  }
};
const supprimerConge = async (req, res) => {
  try {
    const { email, nomPrenom, dateDebut, dateFin } = req.body;

    // Trouver le congé basé sur l'email, nomPrenom, dateDebut, et dateFin
    const conge = await Conge.findOne({
      email: email,
      nomPrenom: nomPrenom,
      dateDebut: dateDebut,
      dateFin: dateFin,
    });

    // Si aucun congé correspondant n'est trouvé
    if (!conge) {
      return res
        .status(404)
        .json({ message: "Aucun congé correspondant trouvé." });
    }

    // Si un congé correspondant est trouvé, procéder à la suppression
    await Conge.deleteOne({ _id: conge._id });
    res.status(200).json({ message: "Congé supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du congé." });
  }
};

const verifierConge = async (req, res) => {
  try {
    const { email, nomPrenom, dateDebut, dateFin } = req.body;
    console.log(email);
    const updated = await Conge.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    console.log(updated);
    /* envoyer email */
    sendNewConge(nomPrenom, email, dateDebut, dateFin);

    res.status(200).json({ message: " conge confirmé " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occcured" });
  }
};

const getVacationData = async (req, res) => {
  try {
    // Récupérer toutes les demandes de congé depuis la base de données
    const vacationData = await Conge.find();

    // Vérifier si des données ont été trouvées
    if (!vacationData) {
      return res
        .status(404)
        .json({ message: "Aucune donnée de congé trouvée." });
    }

    // Pour chaque demande de congé, rechercher les heures travaillées
    for (const conge of vacationData) {
      // Rechercher l'employé correspondant dans la base de données des employés
      const employee = await Employee.findOne({ fullName: conge.nomPrenom });

      if (!employee) {
        // Si l'employé n'est pas trouvé, continuer avec la prochaine demande de congé
        continue;
      }

      // Calculer la date d'il y a trois mois à partir d'aujourd'hui
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      // Rechercher les heures travaillées de l'employé pour les trois derniers mois
      const hoursWorked = await hoursWorked.find({
        employeeId: employee._id,
        date: { $gte: threeMonthsAgo },
      });

      // Ajouter les heures travaillées à la demande de congé
      conge.hoursWorked = hoursWorked.reduce(
        (total, hours) => total + hours.worked,
        0
      );
    }

    // Envoyer les données de congé en réponse
    res.status(200).json(vacationData);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de congé :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données de congé." });
  }
};

const employesConge = async (req, res) => {
  try {
    // Récupérer la date d'aujourd'hui
    const today = moment().format("DD/MM/YYYY");

    // Recherche des employés en congé vérifié et dont la date d'aujourd'hui est entre dateDebut et dateFin
    const employesEnConge = await Conge.find({
      verified: true,
      dateDebut: { $lte: today }, // Date de début <= aujourd'hui
      dateFin: { $gte: today }, // Date de fin >= aujourd'hui
    });

    res.json(employesEnConge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function validateDates(dateDebut, dateFin) {
  return (
    moment(dateDebut, "DD/MM/YYYY", true).isValid() &&
    moment(dateFin, "DD/MM/YYYY", true).isValid()
  );
}

export {
  createConge,
  modifierConge,
  getVacationData,
  supprimerConge,
  verifierConge,
  employesConge,
};
