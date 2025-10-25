import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Signup from "./Components/Signup/Signup";
import Profile from "./Components/Profile/Profile";
import CollectionAgentDashboard from "./Components/CollectionAgent/CollectionAgentDashboard";
import StaffDashboard from "./Components/StaffDashboard/StaffDashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/agent/*" element={
          <ProtectedRoute>
            {<CollectionAgentDashboard/>}
          </ProtectedRoute>
        } />
         
         <Route path="/staff/*" element={
          <ProtectedRoute>
            {<StaffDashboard/>}
          </ProtectedRoute>}/>
          
         
        <Route path ="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </Router>
  );
}

export default App;
