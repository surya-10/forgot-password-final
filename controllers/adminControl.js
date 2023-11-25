import { ObjectId } from "mongodb";
import { client } from "../db.js";

export function findAdmin(email){
    return client.db("forgot-final").collection("admin").findOne({email:email});
}

export async function findAllStudents(){
    let users = await client.db("forgot-final").collection("students").find().toArray();
    const userwithBase = users.map((user)=>{
        // console.log(user.photo)
        return {
            ...user,
            photo: user.photo ? user.photo.toString('base64') : null,
        }
    })
    return userwithBase;
}

export async function findbyId(id){
    let data = await client.db("forgot-final").collection("students").findOne({_id:new ObjectId(id)});
    // data.photo =  data.photo.toString('base64');
    return data;
}