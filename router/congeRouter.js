import express from "express";
import { createConge, modifierConge ,getVacationData, employesConge,verifierConge,supprimerConge} from "../controllers/congeController.js"

const congeRouter = express.Router();

congeRouter.post("/demande-conge", createConge);
congeRouter.put("/modifier_conge", modifierConge);
congeRouter.post("/verifier_conge", verifierConge);
congeRouter.delete("/supprimer-conge", supprimerConge);
congeRouter.get("/getVacationData", getVacationData);
congeRouter.get("/employesConge", employesConge);

export default congeRouter;
