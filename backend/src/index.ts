import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import scheduleRoutes from "./routes/scheduleRoutes";

const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON bodies

// Main route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "vinayak the lord saying hello from server!" });
});

app.use("/schedules", scheduleRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
