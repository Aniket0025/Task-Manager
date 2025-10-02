import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './config/db.js';

import TodoRouter from "./routes/todo.routes.js";



const app = express();

app.use(express.json());


app.use("/api/todos", TodoRouter);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at ${PORT}`);
})