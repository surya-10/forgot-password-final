
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mailgen from "mailgen";
dotenv.config();
import { addUser, checkPassAndId, checkUser, updateNewPasswordToUser, updatePass } from "../controllers/userControl.js";


let router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ msg: "working fine" });
})

router.post("/signup", async (req, res) => {
    try {
        let userData = req.body;
        if (!userData) {
            return res.status(400).json({ status: 400, msg: "fill all fields" })
        }
        let saltValue = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(userData.password, saltValue);
        let obj = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        }
        let isExist = await checkUser(userData.email);
        if (isExist) {
            return res.status(404).json({ status: 404, msg: "exist" })
        }
        let result = await addUser(obj);
        if (!result.acknowledged) {
            return res.status(404).json({ status: 404, msg: "error" })
        }
        return res.status(201).json({ status: 201, msg: "user added" })



    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})

router.post("/login", async (req, res) => {
    try {
        let userData = req.body;
        if (!userData) {
            return res.status(400).json({ status: 400, msg: "fill all fields" })
        }
        let isExist = await checkUser(userData.email);
        if (!isExist) {
            return res.status(404).json({ status: 404, msg: "user does not exist" })
        }
        let checkPass = await bcrypt.compare(userData.password, isExist.password);
        if (!checkPass) {
            return res.status(400).json({ status: 400, msg: "incorrect" });
        }
        return res.status(200).json({ status: 200, msg: "login success" })
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})
async function generatePassword(n){
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzyz";
    let pass = "";
    for(let i=0; i<n; i++){
        let ind = Math.floor(Math.random()*str.length);
        pass += str.charAt(ind)
    }
    return pass;
}

router.post("/forgot", async (req, res) => {
    try {
        let userData = req.body;
        if (!userData) {
            return res.status(400).json({ status: 400, msg: "fill all fields" })
        }
        let isExist = await checkUser(userData.email);
        if (!isExist) {
            return res.status(404).json({ status: 404, msg: "user does not exist" })
        }
        let token =jwt.sign({ id: isExist._id }, process.env.secret_key, { expiresIn: "1d" });
        console.log("toke", token)
        let tempPassword = await generatePassword(20);
        let updateTempPassword = await updatePass(isExist.email, tempPassword)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.adminEmail,
                pass: process.env.adminPass
            }
        });
        let mailGen = new mailgen({
            theme: "default",
            product: {
                name: "Team",
                link: "hello"
            }
        });

        let responseMail = {
            body:{
                name:"User",
                intro:"Good day",
                table:{
                    data:[
                        {
                            item:"Expire time",
                            description:"This reset link will be expired in 24 hours. Please complete it before"
                        },
                        {
                            item:"reset link",
                            description:`http://localhost:3000/reset-password/${isExist._id}/${token}`
                        },
                        {
                            item:"Tempoary password",
                            description:tempPassword
                        }
                    ]
                },
                outro:"Thank you"
            }
        }
        let sendToUser = mailGen.generate(responseMail);



        var mailOptions = {
            from: process.env.adminEmail,
            to: userData.email,
            subject: 'Reset password',
            html: sendToUser
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                return res.status(201).json({ msg: "email sent", status: 201 })
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})

router.post("/reset-password/:id/:token", async (req, res) => {
    let { id, token } = req.params;
    let { password } = req.body;
    let finalResult = false;
    let status = "";
    let verifyToken =jwt.verify(token, process.env.secret_key, (err, decoded) => {
        if (err) {
            finalResult = false;
            status="token expired"
        }
        else{
            finalResult = true;
            status="token verified"
        }
    })
    if(finalResult){
        let checkTempPass = await checkPassAndId(id, password);
        console.log(checkTempPass);
        if(checkTempPass){
            return res.status(200).json({finalResult:checkTempPass, status:"matching"});
        }
        else{
            return res.status(400).json({finalResult:checkTempPass, status:"not"});
        }
        
    }
    else{
    return res.status(400).json({finalResult:finalResult, status:"token expired"});
    }
})

router.post("/update-new-password", async(req, res)=>{
    try {
        let {id, password} = req.body;
        console.log(id, password)
        let saltValue = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, saltValue);
        console.log(hashedPassword);
        let updateNewPassword = await updateNewPasswordToUser(id, hashedPassword);
        return res.status(201).json({response:updateNewPassword});
        
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" })
    }
})

export let userRouter = router;