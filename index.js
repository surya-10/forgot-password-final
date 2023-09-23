import express from "express";
import { client } from "./db.js";
import dotenv from "dotenv";
dotenv.config();
import { userRouter } from "./routes/route.js";
import cors from "cors";




let app = express();
app.use(express.json());
app.use(cors());

// app.use("/", userRouter);

let port = 9001;
app.listen(port, ()=>console.log("server connected"));