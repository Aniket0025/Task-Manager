import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();


//get all todo
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//add a new

router.post('/', async (req, res) => {
    try {
        const { text, complete } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const todo = await Todo.create({
            text: text,
            complete: false,
        });
        res.status(201).json(todo);
    }
    catch (error) {
        res.status(500).json({ Message: error.message })
    }
})


//update

router.patch("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "todo not found" });

        if (req.body.text !== undefined) {
            todo.text = req.body.text;

        }

        if (req.body.complete !== undefined) {
            todo.complete = req.body.complete;
        }

        const updateTodo = await todo.save();
        res.json(updateTodo);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//delete

router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id)
        res.json({ message: "todo deleted" })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})



export default router;