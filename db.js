import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

let str = "mongodb+srv://forgot:forgot@cluster0.zjxmjix.mongodb.net/?retryWrites=true&w=majority";
async function dbConnection(){
    let client = new MongoClient(str);
    await client.connect();
    console.log("DB connected");
    return client;
}
export let client = await dbConnection();