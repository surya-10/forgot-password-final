import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { client } from "../db.js";
import { Binary } from "mongodb";
import { addNewStudent, findStudent, updateStudImg, updateStudentData, updateStudentDataWithoutPhoto } from "./userRoutes.js";
dotenv.config();
let userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
userRouter.post("/add/user", upload.single('photo'), async (req, res) => {
    try {
        const { firstname, lastname, email, dob, number, gender, about, college, age } = req.body;
        const photo = req.file.buffer;
        const binaryPhoto = new Binary(photo);
        let checkIsExist = await findStudent(email);
        if(checkIsExist==true){
            return res.json({msg:"exist", status:404});
        }
        let createUser = await addNewStudent({ firstname: firstname, lastname: lastname, age: age, email: email, dob: dob, gender: gender, college: college, about: about, number: number, photo: binaryPhoto });
        if (createUser) {
            return res.status(201).json({ msg: "success", status: 201 })
        }

    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})


userRouter.post("/update/user/:id" ,upload.single('photo'), async(req, res)=>{
    let {id} = req.params;
    const photo = req.file.buffer;
    const binaryPhoto = new Binary(photo);
    // console.log(binaryPhoto);
    let updateImg = await updateStudImg(id, binaryPhoto);
    if (updateImg) {
        return res.status(201).json({ msg: "success", status: 201 })
    }

    
})

userRouter.post("/update/user/data/:id" ,upload.single('photo'), async(req, res)=>{
    let {id} = req.params;

    const { firstname, lastname, email, dob, number, gender, about, college, age } = req.body;
    let updateRemainingData = await updateStudentDataWithoutPhoto(id, firstname, lastname, email, dob, number, gender, about, college, age);
    if(updateRemainingData){
        return res.status(200).json({status:200, msg:"updated"});
    }
        
})

export let studentRouter = userRouter;