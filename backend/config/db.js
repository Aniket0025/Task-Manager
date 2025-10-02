import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const mongo = process.env.MONGO_URL;


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongo)
        console.log(`MongoDB Connected ${conn.connection.host}`)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }


}