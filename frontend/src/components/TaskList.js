import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchTasks();
    }, []);
  
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    const addTask = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/api/tasks', newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNewTask({ title: '', description: '' });
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
  
    const updateTask = async (id, updates) => {
      try {
        await axios.patch(`http://localhost:5000/api/tasks/${id}`, updates, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };
  
    const deleteTask = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 text-white font-bold">Task Manager</div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="ml-3">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Task List Section */}
      <div className="max-w-md mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task List</h1>
        </div>
        <form onSubmit={addTask} className="mb-4 space-y-2">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className="w-full px-3 py-2 border rounded-md"
          rows="3"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Add Task
        </button>
      </form>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>
              <div>
                <button
                  onClick={() => updateTask(task._id, { completed: !task.completed })}
                  className={`mr-2 px-3 py-1 rounded ${
                    task.completed
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            {task.description && (
              <p className={`mt-2 text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default TaskList;
