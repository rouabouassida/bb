import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";
import * as editPasswordController from "../controllers/editPassword.js";
// Routes pour les fonctionnalités de l'utilisateur
userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/ajouterEmploye", userController.ajouterEmploye);
userRouter.put("/supprimerEmploye", userController.supprimerEmploye);  // Change DELETE to PUT
userRouter.put("/editPassword", userController.editPassword);
userRouter.put("/edit-name", userController.editName);
userRouter.post("/logout", userController.logout);
// Route pour récupérer l'e-mail de l'utilisateur connecté
userRouter.get("/getUserEmail", userController.getUserEmail);
userRouter.post("/forget-password", userController.ForgetPassword);
userRouter.put("/modifierEmploye",userController.modifierEmploye)
userRouter.put("/edit-password", editPasswordController.editPassword)
export default userRouter;
