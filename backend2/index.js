import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Aniket")

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})