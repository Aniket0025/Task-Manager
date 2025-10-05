import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db.js";
import router from "./routes/user.js";
import cors from "cors";



const app = express();
app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
    res.send("Hello Aniket")

})

app.use("/app/v1/user", router);




const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server started at ${PORT}`);
})