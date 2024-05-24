import express from "express";
const router = express.Router();
// Importer les fonctions spécifiques depuis le contrôleur de l'employé
import {
  createEmployee,
  createEntry,
  updateExitTimeAndHoursWorked,
  getEmployeesPresentiel,
  getEmployeesRemote,
  getAllEmployees,
  getEmployeeInfoForToday,
  getActiveEmployee
} from "../controllers/employeeController.js";
import { authenticateUser } from "../middlewares/auth.js";

// Définir les routes en utilisant les fonctions importées directement
router.post("/createEmployee", createEmployee);
router.post("/createEntry", createEntry);
router.patch("/updateExitTimeAndHoursWorked/:id", updateExitTimeAndHoursWorked);
router.get("/presentiel", getEmployeesPresentiel);
router.get("/remote", getEmployeesRemote);
router.get("/getAllEmployees", getAllEmployees); // Nouvelle route pour récupérer tous les employés
router.get("/getEmployeeInfoForToday/:name", getEmployeeInfoForToday); // Nouvelle route pour récupérer tous les employés
router.post("/getActiveEmployee", getActiveEmployee);

// Exporter le routeur
export default router;
