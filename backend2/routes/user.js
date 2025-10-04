import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { TaskModel, UserModel } from "../db.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
dotenv.config();

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



// Login route
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWTSECRET || "secretkey",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed"
        });
    }
});

// Add Todo
router.post("/todos", auth, async (req, res) => {
    try {
        const todo = await TaskModel.create({
            userId: req.decoded.userId,
            title: req.body.title
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Failed to add todo" });
    }
});

// Get Todos 
router.get("/todos", auth, async (req, res) => {
    try {
        const todos = await TaskModel.find({ userId: req.decoded.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todos" });
    }
});

// Update Todo
router.put("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await TaskModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.decoded.userId },
            { title: req.body.title, completed: req.body.completed },
            { new: true }
        );
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: "Failed to update todo" });
    }
});

// Delete Todo
router.delete("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await TaskModel.findOneAndDelete({ _id: req.params.id, userId: req.decoded.userId });
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo" });
    }
});

export default router;