import { InhashData, hashData } from "../helpers/bcrypt.js";
import User from "../models/user.js";

const editPassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordMatch = InhashData(newPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashedNewPassword = await hashData(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export { editPassword };