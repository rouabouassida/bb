import RemoteJob from "../models/remoteJob.js"; // Correction du chemin d'importation
import User from "../models/user.js";

// Contrôleur pour gérer les demandes d'emploi à distance
const remoteController = {
  // Méthode pour soumettre une nouvelle demande d'emploi à distance
  submitRemoteJob: async (req, res) => {
    try {
      const userLoggedIn = await User.findOne({ email: req.body.email });

      if (!userLoggedIn) {
        return res.status(401).json({ error: "Utilisateur non autorisé." });
      }

      const { email: userLoggedInEmail, fullname: userLoggedInFullName } =
        userLoggedIn;

      const { nomPrenom, email, date } = req.body;

      if (userLoggedInEmail !== email || userLoggedInFullName !== nomPrenom) {
        return res.status(400).json({
          error:
            "L'email ou le nom ne correspond pas à l'utilisateur connecté.",
        });
      }

      // Créer une nouvelle instance de RemoteJob avec les données soumises
      const newRemoteJob = new RemoteJob({
        nomPrenom,
        email,
        date,
      });

      // Enregistrer la demande dans la base de données
      await newRemoteJob.save();

      // Envoyer une réponse de succès
      res
        .status(201)
        .json({ message: "Demande d'emploi à distance soumise avec succès" });
    } catch (error) {
      // En cas d'erreur, envoyer une réponse d'erreur
      console.error(
        "Erreur lors de la soumission de la demande d'emploi à distance :",
        error
      );
      res.status(500).json({
        message: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      });
    }
  },
};

export default remoteController;
