import React from "react"; // react library
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
// Import Router components:
// - Router: wraps your app and enables routing
// - Routes: wraps all your individual routes
// - Route: defines a specific path and what to show
// - Navigate: redirects from one route to another

function App() {
  return (
    <Router> {/* Enables functionality of routing inside the app */ }
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} /> { /* if someone visits this path, it takes them to login */ }

        <Route path='/signup' element={<Signup />} /> {/* When the url "/signup" is shown, shows the signup */}

        <Route path='/login' element={<Login />} /> {/* when the url is "/login" is shown, shows the login */}

        <Route path='/home' element={<Home />} /> { /* when the url is "/home" is home, shows the home */ } 
        
      </Routes>
    </Router>
  );
}

export default App;