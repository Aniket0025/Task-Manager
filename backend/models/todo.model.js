import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    complete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;