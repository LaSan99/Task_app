import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';

function App() {
  //const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/task" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          {/* <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} /> */}
        </Routes>
    </Router>
  );
}

export default App;

