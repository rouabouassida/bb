import { compareHash, hashData } from "../helpers/bcrypt.js"; // Assurez-vous que la fonction compareData est correctement importée
import Rh from "../models/rh.js";

const editPasswordRh = async (req, res) => {
  const { rhId, currentPassword, newPassword } = req.body;

  if (!rhId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const rh = await Rh.findById(rhId);

    if (!rh) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordMatch = await compareHash(currentPassword, rh.password); // Compare the current password with the stored password

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashedNewPassword = await hashData(newPassword);
    rh.password = hashedNewPassword;
    await rh.save();

    res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export { editPasswordRh };
