// The dotenv package is used to load environment variables from a .env file.
// It's crucial to call config() at the very top of the entry file,
// so that all other files have access to process.env variables.
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import scheduleRoutes from "./routes/scheduleRoutes"; // Import our custom router
import cors from "cors";

const app = express();
const port = 3001;

// This is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads.
// Without this, req.body would be undefined for JSON requests.
// Replace the simple app.use(cors()); with this:
app.use(
  cors({
    origin: "https://scheduler-vinny.vercel.app",
  })
);
app.use(express.json());

// A simple health-check route to confirm the API is running.
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is alive and kicking!" });
});

// This line mounts the scheduleRoutes router.
// It tells the app to use our router for any URL that starts with '/schedules'.
// For example, a request to /schedules/exceptions will be handled by our router.
app.use("/schedules", scheduleRoutes);

// Starts the server and makes it listen for incoming requests on the specified port.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
