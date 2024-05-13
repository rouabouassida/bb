import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import Connect_DB from "./config/connect.js";
import userRouter from "./router/userRouter.js";
import rhRouter from "./router/rhRouter.js";
import employeeRouter from "./router/employeeRouter.js";
import congeRouter from "./router/congeRouter.js";
import remoteRouter from "./router/remoteRouter.js";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Our Server!");
});
app.use("/rh", rhRouter);
app.use("/employees", employeeRouter);
app.use("/user", userRouter);
app.use("/conge", congeRouter);
app.use("/remote", remoteRouter);

// Connect to the database
Connect_DB().then((db) => {
  if (db) {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } else {
    console.log("Failed to connect to the database...");
  }
});
