import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
let connectionStr = process.env.conStr;
export async function mongoConnection(){
    let client = new MongoClient(connectionStr);
    await client.connect();
    console.log("Database connected");
    return client;
}
export const client = await mongoConnection();