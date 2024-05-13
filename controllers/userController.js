import User from "../models/user.js";
import { sendNewAccountInfo, sendUpdateInfo ,sendPasswordReset } from "../helpers/sendEmail.js";
import { InhashData, hashData, compareHash } from "../helpers/bcrypt.js";
import jwt from "jsonwebtoken";
import createToken from "../helpers/createToken.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const foundedUser = await User.findOne({ email });

    if (!foundedUser) {
      return res.status(404).json({ message: "Email incorrect" });
    }

    const isPasswordMatch = await compareHash(password, foundedUser.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ error: "Informations de connexion invalides" });
    }

    const token = createToken(foundedUser._id, foundedUser.fullname);

    res
      .status(200)
      .json({
        token,
        email: foundedUser.email,
        fullname: foundedUser.fullname,
        _id: foundedUser._id,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
const rhAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required!" });
  }

  const passwordLength = 12; // Longueur personnalisée du mot de passe
  const password = generatePassword(passwordLength); // Générer un mot de passe aléatoirecd
  const cryptedPassword = await hashData(password);

  try {
    const user = await User.create({
      email,
      password: cryptedPassword,
    });

    if (user) {
      console.log(user);
    }

    //  sendAccountInfo(email, password);
    res.status(201).json({ message: "account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Votre fonction de création d'employé
const ajouterEmploye = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé !" });
    }

    const hashedPassword = await hashData(password);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    sendNewAccountInfo(email, fullname, password); // Envoi des informations du compte par email

    return res.status(201).json({ message: "Employé ajouté avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'employé :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

const modifierEmploye = async (req, res) => {
  // Récupération des données de la requête
  const { name, email, password } = req.body;

  try {
    // Recherche de l'utilisateur dans la base de données par son adresse e-mail
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé !" });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await hashData(password);

    // Mise à jour des informations de l'utilisateur
    existingUser.name = name;
    existingUser.password = hashedPassword;

    // Enregistrement des modifications dans la base de données
    await existingUser.save();

    // Envoi des informations mises à jour par email
    sendUpdateInfo(email, name, password); // Assurez-vous d'adapter la fonction sendAccountInfo pour qu'elle envoie un nouvel email avec les informations mises à jour

    // Réponse réussie
    return res
      .status(200)
      .json({ message: "Informations de l'employé modifiées avec succès !" });
  } catch (error) {
    console.error(
      "Erreur lors de la modification des informations de l'employé :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
const supprimerEmploye = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Suppression de l'utilisateur
    await User.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
const getUserEmail = async (req, res) => {
  try {
    // Vérifiez si le token JWT est présent dans les en-têtes de la requête
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token non fourni" });
    }

    // Vérifiez et décodez le token JWT pour obtenir les informations de l'utilisateur
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken.email) {
      return res.status(401).json({ message: "Token non valide" });
    }

    // Récupérez l'e-mail de l'utilisateur à partir du token JWT
    const userEmail = decodedToken.email;

    // Renvoyez l'e-mail de l'utilisateur dans la réponse
    return res.status(200).json({ email: userEmail });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'e-mail de l'utilisateur :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
const storeEmail = async (email) => {
  try {
    await AsyncStorage.setItem("userEmail", email);
    console.log("E-mail enregistré avec succès dans AsyncStorage");
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de l'e-mail dans AsyncStorage :",
      error
    );
  }
};

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

    // Vérifie si le mot de passe actuel correspond au mot de passe stocké
    const isPasswordMatch = await comparePassword(currentPassword, user.password);

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


const editName = async (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "Le champ est requis !" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.fullname = name;
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
    const foundedUser = await User.findOne({ email });

    if (!foundedUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    const passwordLength = 12; // Longueur personnalisée du mot de passe
    const password = generatePassword(passwordLength); // Générer un mot de passe aléatoire
    const cryptedPassword = await hashData(password);

    foundedUser.password = cryptedPassword;
    await foundedUser.save();

    sendPasswordReset(email, password);

    res.status(201).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export {
  storeEmail,
  login,
  supprimerEmploye,
  rhAccount,
  ajouterEmploye,
  modifierEmploye,
  getUserEmail,
  editName,
  editPassword,
  logout,
  ForgetPassword
};
