import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../db.js";
dotenv.config();
const router = express.Router();


router.post("/signup", async (req, res) => {

    const requireBody = z.object({
        username: z.string().min(5).max(50),
        email: z.string().email().min(5).max(50),
        password: z.string().min(5).max(15)
    });

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const hashedPassword = await bcrypt.hash(password, 10);
    const parsedData = requireBody.safeParse(req.body);

    if (parsedData.success) {
        const userexist = await UserModel.findOne({ email: email });

        if (userexist) {
            res.status(400).json({
                message: "User already Exist"
            })
        }
        else {
            try {
                await UserModel.create({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    role: role
                })
                res.status(201).json({
                    message: "Signup successfully"
                })
            } catch (error) {
                res.status(500).json({
                    message: "Signup failed"
                })
            }
        }
    }
    else {
        res.status(400).json({
            message: "invalid input"
        })
    }
})


router.post("/signin", async (req, res) => {
    const requireBody = z.object({
        email: z.string().email().min(3).max(50),
        password: z.string().min(5).max(15)
    });

    const email = req.body.email;
    const password = req.body.password;

    const parsedData = requireBody.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(500).json({
            message: "Invalid Input"
        })
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Signin successfull",
            token
        })


    } catch (error) {
        res.status(500).json({ message: "Signin failed", error: error.message });
    }
})


export default router;