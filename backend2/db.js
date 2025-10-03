import mongoose from "mongoose";
import { configDotenv } from "dotenv";

mongoose.connect(process.env.MONGO_UR)

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const roletypes = ["admin", "user"]

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: roletypes, required }

});

const TaskSchema = new Schema({
    title: { type: String, required: true },
    complete: { type: Boolean }
})

const UserModel = mongoose.model("users", UserSchema);
const TaskModel = mongoose.model("task", TaskSchema);

export default { UserModel, TaskModel };