import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "https://event-platform-three.vercel.app"
    ],
    credentials: true,
  })
);

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