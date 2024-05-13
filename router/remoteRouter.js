import express from "express";
import remoteController from "../controllers/remoteController.js";
// Créer un routeur Express pour gérer les demandes d'emploi à distance
const remoteRouter = express.Router();

// Route pour soumettre une nouvelle demande d'emploi à distance
remoteRouter.post("/submit", remoteController.submitRemoteJob);

export default remoteRouter;
