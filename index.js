import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// dotenv.config();
import { client } from "./db.js";
// import { userRouter } from "./routes/route.js";

let app = express();

app.use(cors());
app.use(express.json());


// app.use("/", userRouter);

let port = 9001;
app.listen(port, ()=>console.log("server connected"));