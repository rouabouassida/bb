import { submitRemoteJob, verifierRemote ,getRemoteData} from "../controllers/remoteController.js";
import express from "express";

const router = express.Router();

router.post("/submit", submitRemoteJob);
router.post("/verify", verifierRemote);
router.get("/getRemoteData", getRemoteData);

export default router;