import { ObjectId } from "mongodb";
import { client } from "../db.js";

export function addNewStudent(studentData){
    return client.db("forgot-final").collection("students").insertOne(studentData);
}
export async function findStudent(email){
    let a = await client.db("forgot-final").collection("students").findOne({email:email});
    if(a){
        return true;
    }
    else{
        return false;
    }
}

export async function deleteStudent(id){
    let result = await client.db("forgot-final").collection("students").deleteOne({_id: new ObjectId(id)});
    return result.acknowledged;
}

export async function updateStudentData(id, firstname, lastname, email, dob, number, gender, about, college, age, photo){
    let a = await  client.db("forgot-final").collection("students").updateOne({_id: new ObjectId(id)}, {$set:{firstname:firstname, lastname:lastname, age:age, number:number, dob:dob, about:about, email:email, college:college, photo:photo, gender:gender}});
}
export async function updateStudentDataWithoutPhoto(id, firstname, lastname, email, dob, number, gender, about, college, age){
    let a = await  client.db("forgot-final").collection("students").updateOne({_id: new ObjectId(id)}, {$set:{firstname:firstname, lastname:lastname, age:age, number:number, dob:dob, about:about, email:email, college:college, gender:gender}});
    return a.acknowledged;
}

export function updateStudImg(id, photo){
    return client.db("forgot-final").collection("students").updateOne({_id:new ObjectId(id)}, {$set:{photo:photo}})
}