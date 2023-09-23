import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();


let str = "mongodb+srv://forgot:forgot@cluster0.zjxmjix.mongodb.net/?retryWrites=true&w=majority";
export async function dbConnection(){
    let client = new MongoClient(str);
    await client.connect();
    console.log("DB connected");
    return client;
}
export const client = await dbConnection();