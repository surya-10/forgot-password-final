import { client } from "../db.js";
import { ObjectId } from "mongodb";

export function addUser(obj){
    return client.db("forgot-final").collection("users").insertOne(obj);
}

export function checkUser(email){
    return client.db("forgot-final").collection("users").findOne({email:email});
}

export async function findId(id){
    let a = await client.db("forgot-final").collection("users").findOne({_id:new ObjectId(id)});
    return a;
}
export async function updatePass(email, password){
    let res = await client.db("forgot-final").collection("users").updateOne({email:email}, {$set:{"tempPassword":password}})
}

export async function checkPassAndId(id, pass){
    let a = await client.db("forgot-final").collection("users").findOne({$and:[{_id:new ObjectId(id)}, {"tempPassword":{$eq:pass}}]});
    if(a){
        return true;
    }
    else{
        return false;
    }
}

export async function updateNewPasswordToUser(id, password){
    let findUser = await client.db("forgot-final").collection("users").updateOne({_id:new ObjectId(id)}, {$set:{password:password}});
    let removefield = await client.db("forgot-final").collection("users").updateOne({_id:new ObjectId(id)}, {$unset:{"tempPassword":1}});
    return removefield.acknowledged;
}