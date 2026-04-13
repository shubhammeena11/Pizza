import express, { urlencoded } from "express";
import cors from "cors";

import { APP_PORT } from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/DB.js";

// ------------------ INIT ------------------
const app = express();
connectDB();

// ------------------ MIDDLEWARES ------------------
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

// ------------------ ROUTES ------------------
app.use("/api", routes);

// ------------------ ERROR HANDLER ------------------
app.use(errorHandler);

// ------------------ START SERVER ------------------
app.listen(APP_PORT, () =>
  console.log(`Server is running on port ${APP_PORT}`)
);