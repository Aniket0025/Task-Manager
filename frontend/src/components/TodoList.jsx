import axios from "axios";
import { useEffect, useState } from "react";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const token = localStorage.getItem("token"); // get JWT token

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/app/v1/user/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/app/v1/user/todos",
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Delete a todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/app/v1/user/todos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Toggle completed
  const handleToggle = async (todo) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/app/v1/user/todos/${todo._id}`,
        { ...todo, completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Start editing a todo
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.title);
  };

  // Save edited todo
  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/app/v1/user/todos/${id}`,
        { title: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Todo List</h1>

      {/* Add Todo */}
      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow p-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded-r-md"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center justify-between bg-white p-3 rounded-md shadow"
          >
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-grow p-2 border rounded-md mr-2"
                />
                <button
                  onClick={() => handleSaveEdit(todo._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-3 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div
                  className={`flex-1 cursor-pointer ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                  onClick={() => handleToggle(todo)}
                >
                  {todo.title}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
