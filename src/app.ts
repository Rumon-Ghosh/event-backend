import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./routes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://event-era-pearl.vercel.app",
    ],
    credentials: true,
  })
);

// parser
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router)

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.send('Event Management Server is running!');
});

// Not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;