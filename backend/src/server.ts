import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/data-source";
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.routes";
import hrRoutes from './routes/hr'
import employeeRoutes from './routes/employee' 

dotenv.config()

const app = express();


app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/hr", hrRoutes);
app.use("/employee", employeeRoutes);

app.get("/", (req, res) => {
  res.send("HRMS Backend is running 🚀");
});


AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected!");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
});


 



