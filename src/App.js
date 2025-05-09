import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherDashboard from "./Components/Teacher-Dashboard/TeacherDashboard"
import TeacherSignUp from "./Components/teacherSignUp/teacherSignUp"
import TeacherLogIn from "./Components/TeacherLogin/teacherLogIn"
import TeacherDetails from "./Components/TeacherDetails/TeacherDetails"
import StudentsPage from "./Components/StudentsPage/Students"
import Attendance from "./Components/Attendance/Attendance"
import PerformancePage from "./Components/Performance/Performance";
import Grades from "./Components/Grades/Grades";



function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<TeacherDashboard/>} />
      <Route path="/signup" element={<TeacherSignUp />} />
      <Route path="/login" element={<TeacherLogIn/>} />
      <Route path="/studentpage" element ={<StudentsPage/>} />
      <Route path="/teacherdetails" element ={<TeacherDetails/>} />
      <Route path="/attendance" element ={<Attendance/>} />
      <Route path="/performance" element={<PerformancePage/>} />
      <Route path= "/grades" element={<Grades/>} />
    </Routes>
  </Router>
  );
}
export default App;