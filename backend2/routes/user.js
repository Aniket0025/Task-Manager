import express from "express"
const router = express.Router();
import { Model } from "mongoose";
import { UserModel, TaskModel } from "../db.js"
import { z } from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from dotenv;
dotenv.config();

router.post("signup", async (req, res) => {

    const requireBody = z.object({
        username: z.string().min(5).max(50),
        email: z.email().min(5).max(50),
        password: z.string().min(5).max(15)
    });

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const parsedData = requireBody.safeParse(req.body);

    if (parsedData.success) {
        const userexist = await UserModel.findOne({ email: email })
    }



})