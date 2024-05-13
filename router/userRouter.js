import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";

// Routes pour les fonctionnalités de l'utilisateur
userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/ajouterEmploye", userController.ajouterEmploye);
userRouter.delete("/supprimerEmploye", userController.supprimerEmploye);
userRouter.put("/editPassword", userController.editPassword);
userRouter.put("/edit-name", userController.editName);
userRouter.post("/logout", userController.logout);
// Route pour récupérer l'e-mail de l'utilisateur connecté
userRouter.get("/getUserEmail", userController.getUserEmail);
userRouter.post("/forget-password", userController.ForgetPassword);


export default userRouter;
