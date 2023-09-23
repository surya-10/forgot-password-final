import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
let connectionStr = "mongodb+srv://forgot:forgot@cluster0.zjxmjix.mongodb.net/?retryWrites=true&w=majority";
export async function mongoConnection(){
    let client = new MongoClient(connectionStr);
    await client.connect();
    console.log("Database connected");
    return client;
}
export const client = await mongoConnection();