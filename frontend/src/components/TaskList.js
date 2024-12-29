import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WhatsAppButton from "./WhatsAppButton";
import Chat from "./Chat";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar - updated colors */}
      <nav className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 text-blue-400 font-bold text-xl">
                Task Manager
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-300 hover:bg-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="ml-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Task List Section - updated colors and styling */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Task List</h1>
        </div>
        <form onSubmit={addTask} className="mb-6 space-y-3">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
            required
          />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Task description"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
            rows="3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Add Task
          </button>
        </form>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-semibold ${
                    task.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateTask(task._id, { completed: !task.completed })
                    }
                    className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                      task.completed
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <WhatsAppButton task={task} />
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {task.description && (
                <p
                  className={`mt-2 ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-300"
                  }`}
                >
                  {task.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Chat</h2>
        <Chat />
      </div>
    </div>
  );
}

export default TaskList;
