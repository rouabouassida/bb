import Rh from "../models/rh.js";
import { sendNewAccountInfo ,sendPasswordReset} from "../helpers/sendEmail.js";
import { InhashData, hashData, compareHash } from "../helpers/bcrypt.js";
import bcrypt from "bcrypt"; // Import de bcrypt nécessaire pour utiliser compare
import createToken from "../helpers/createToken.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const foundedRh = await Rh.findOne({ email });

    if (!foundedRh) {
      return res.status(404).json({ message: "Email incorrect" });
    }

    const isPasswordMatch = await compareHash(password, foundedRh.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ error: "Informations de connexion invalides" });
    }

    const token = createToken(foundedRh._id, foundedRh.fullname);

    res
      .status(200)
      .json({
        token,
        email: foundedRh.email,
        fullname: foundedRh.fullname,
        _id: foundedRh._id,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
const ajouterRh = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const existingRh = await Rh.findOne({ email }); // Utilisez Rh.findOne au lieu de User.findOne
    if (existingRh) {
      return res.status(400).json({ message: "Cet email est déjà utilisé !" });
    }

    const hashedPassword = await hashData(password);

    const newRh = new Rh({
      fullname,
      email,
      password: hashedPassword,
    });

    await newRh.save();

    sendNewAccountInfo(email, fullname, password); // Envoi des informations du compte par email

    return res.status(201).json({ message: "Rh ajouté avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de le RH :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
const storeEmail = async (email) => {
  try {
    await AsyncStorage.setItem("rhEmail", email);
    console.log("E-mail enregistré avec succès dans AsyncStorage");
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de l'e-mail dans AsyncStorage :",
      error
    );
  }
};
const supprimerRh = async (req, res) => {
  const { email } = req.query;

  try {
    const rh = await Rh.findOne({ email });

    if (!rh) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Suppression de l'utilisateur
    await Rh.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const editPassword = async (req, res) => {
  const { rhId, currentPassword, newPassword } = req.body;

  if (!rhId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const rh = await Rh.findById(rhId);

    if (!rh) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordMatch = InhashData(newPassword, rh.password);

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

const editName = async (req, res) => {
  const { rhId, name } = req.body;

  if (!rhId || !name) {
    return res.status(400).json({ message: "Le champ est requis !" });
  }

  try {
    const rh = await Rh.findById(rhId);

    if (!rh) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    rh.fullname = name;
    await user.save();
    res.status(200).json({ message: "Nom modifié avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).send("Déconnexion réussie");
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
    res.status(500).send("Erreur lors de la déconnexion");
  }
};
const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required!" });
  }

  try {
    const foundedRh = await Rh.findOne({ email });

    if (!foundedRh) {
      return res.status(404).json({ message: "Email not found" });
    }

    const passwordLength = 12; // Longueur personnalisée du mot de passe
    const password = generatePassword(passwordLength); // Générer un mot de passe aléatoire
    const cryptedPassword = await hashData(password);

    foundedRh.password = cryptedPassword;
    await foundedRh.save();

    sendPasswordReset(email, password);

    res.status(201).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  login,
  ajouterRh,
  ForgetPassword,
  logout,
  editName,
  editPassword,
  storeEmail,
  supprimerRh,
};
