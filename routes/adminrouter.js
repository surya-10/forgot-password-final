
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mailgen from "mailgen";
import { findAdmin, findAllStudents, findbyId } from "../controllers/adminControl.js";
import { deleteStudent } from "./userRoutes.js";
dotenv.config();

let adminrouter = express.Router();

adminrouter.post("/admin/login", async(req, res)=>{
    try {
        let {email, accessKey} = req.body;
        let checkUser = await findAdmin(email);
        if(!checkUser){
            return res.status(404).json({msg:"not found", status:404, resp:false})
        }
        if(checkUser.accessKey!=accessKey){
            return res.status(404).json({msg:"accesskey incorrect", status:404, resp:false})
        }
        return res.status(200).json({msg:"success", status:200, resp:true});
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
});

adminrouter.get("/students/all", async(req, res)=>{
    try {
        let students = await findAllStudents();
        return res.status(200).json({data:students, status:200})
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})
adminrouter.delete("/student/delete/:id", async(req, res)=>{
    try {
        let id = req.params;
        console.log(id);
        let deletestud = await deleteStudent(id);
        if(deletestud){
            return res.status(200).json({msg:"deleted success", status:200});
        }
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})
adminrouter.get("/student/:id", async(req, res)=>{
    try {
        let id = req.params;
        
        let findStudentById = await findbyId(id);
        
        if(findStudentById){
            return res.status(200).json({msg:"success", data:findStudentById})
        }
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})

export default adminrouter;