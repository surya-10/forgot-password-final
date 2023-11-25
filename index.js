import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import { client } from "./db.js";
import { userRouter } from "./routes/route.js";
import { studentRouter } from "./routes/users.js";
import adminrouter from "./routes/adminrouter.js";

let app = express();

app.use(cors());
app.use(express.json());


app.use("/", userRouter);
app.use("/", studentRouter);
app.use("/access", adminrouter);

let port = process.env.port;
app.listen(port, ()=>console.log("server connected"));