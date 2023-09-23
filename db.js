import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let str = process.env.conStr;
async function dbConnection(){
    let client = new MongoClient(str);
    await client.connect();
    console.log("DB connected");
    return client;
}
export let client = await dbConnection();