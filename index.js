import express from "express";
import { client } from "./db.js";
import { userRouter } from "./routes/route.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
options.includeResultMetadata = options.includeResultMetadata !== undefined && options.includeResultMetadata !== null ? options.includeResultMetadata : false;


let app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter)

let port = process.env.port;
app.listen(port, ()=>console.log("server connected"));