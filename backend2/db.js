import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();


const mongo = process.env.MONGO_URL || "mongodb://localhost:27017/task";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongo)
        console.log(`MongoDB Connected ${conn.connection.host}`)
    } catch (err) {
        console.log(err);
        process.exit(1);
    }


}



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const roletypes = ["admin", "user"]

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: roletypes, required: true }

});

const TaskSchema = new Schema({
    title: { type: String, required: true },
    complete: { type: Boolean, default: false }
})

export const UserModel = mongoose.model("users", UserSchema);
export const TaskModel = mongoose.model("task", TaskSchema);

//export default { UserModel, TaskModel };