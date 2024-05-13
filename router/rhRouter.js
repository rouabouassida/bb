import express from "express";
import * as rhController from "../controllers/rhController.js";
const rhRouter = express.Router();

rhRouter.post("/login", rhController.login);
rhRouter.post("/ajouterRh", rhController.ajouterRh);
rhRouter.post("/forget-password", rhController.ForgetPassword);
rhRouter.delete("/supprimerRh", rhController.supprimerRh);
rhRouter.put("/edit-password", rhController.editPassword);
rhRouter.put("/edit-name", rhController.editName);
rhRouter.post("/logout", rhController.logout);

export default rhRouter;
