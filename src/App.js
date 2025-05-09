import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherSignUp from "./Components/teacherSignUp/teacherSignUp";
import TeacherLogIn from "./Components/TeacherLogin/teacherLogIn";
import Dashboard from "./Components/Teacher-Dashboard/TeacherDashboard";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<TeacherLogIn />} />
      <Route path="/signup" element={<TeacherSignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
  );
}
export default App;