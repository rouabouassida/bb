import express from "express";
import { createConge, modifierConge ,getVacationData, employesConge,verifierConge,supprimerConge} from "../controllers/congeController.js"
import { authenticateUser } from "../middlewares/auth.js";

const congeRouter = express.Router();

// Route pour créer une nouvelle demande de congé
congeRouter.post("/demande-conge", createConge);
congeRouter.put("/modifier_conge", modifierConge);
congeRouter.post("/verifier_conge", verifierConge);
congeRouter.delete("/supprimer-conge", supprimerConge);

congeRouter.get("/getVacationData", getVacationData);
congeRouter.get("/employesConge", employesConge);

export default congeRouter;
