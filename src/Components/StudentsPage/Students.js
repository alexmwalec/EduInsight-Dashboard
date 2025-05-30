import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Photos/Logo.jpg";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaBook,
  FaChartLine,
} from "react-icons/fa";

const StudentPage = () => {
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }
  }, []);

  useEffect(() => {
    if (teacher) fetchStudents();
  }, [teacher]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students?class_assigned=${encodeURIComponent(teacher.class_assigned)}`
      );
      const data = await res.json();
      setStudentList(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!teacher) return;

    const newStudent = {
      name: e.target.name.value,
      sex: e.target.sex.value,
      class_assigned: teacher.class_assigned,
      parent: e.target.parent.value,
      contact: e.target.contact.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (res.ok) {
        e.target.reset();
        fetchStudents();
      } else {
        console.error("Server error while adding student.");
      }
    } catch (err) {
      console.error("Add student error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    navigate("/login");
  };

  const getLastName = () => {
    if (!teacher?.full_name) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  const filteredStudents = studentList.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="border rounded-full w-[100px] h-[100px] border-white overflow-hidden">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-semibold mt-2">Thando Academy</h1>
        </div>
        <nav className="flex-1 p-6 space-y-6">
               <Link to="/" className="flex items-center gap-3 text-lg hover:text-indigo-300">
                 <FaHome /> Dashboard
               </Link>
       
               <Link to="/studentpage" className="flex items-center gap-3 text-lg hover:text-indigo-300">
                 <FaUserGraduate /> Students
               </Link>
       
               <Link to="/attendance" className="flex items-center gap-3 text-lg hover:text-indigo-300">
                 <FaClipboardList /> Attendance
               </Link>
       
               <Link to="/grades" className="flex items-center gap-3 text-lg hover:text-indigo-300 font-semibold">
                 <FaBook /> Grades
               </Link>
       
               <Link to="/performance" className="flex items-center gap-3 text-lg hover:text-indigo-300">
                 <FaChartLine /> Performance
               </Link>
             </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {teacher?.photo ? (
                <img
                  src={teacher.photo}
                  alt="Teacher"
                  className="w-10 h-10 rounded-full object-cover border border-indigo-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center">
                  {teacher?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "?"}
                </div>
              )}
              <span className="ml-2">
                {teacher ? `Mr. ${getLastName()}` : "Loading..."}
              </span>
              <FaChevronDown
                className={`text-indigo-700 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
              <FaBell className="text-indigo-700 ml-3" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  to="/teacherdetails"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Teacher Details
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Search Input */}
        <div className="mb-4 relative w-full max-w-md">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by student name..."
            className="w-full pl-4 pr-10 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Student Form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Add New Student</h2>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="name" type="text" placeholder="Full Name" required className="border px-3 py-2 rounded" />
            <select name="sex" required className="border px-3 py-2 rounded">
              <option value="">Sex</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <input
              name="class_assigned"
              type="text"
              value={teacher?.class_assigned || ""}
              readOnly
              className="border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <input name="parent" type="text" placeholder="Parent's Name" required className="border px-3 py-2 rounded" />
            <input name="contact" type="text" placeholder="Parent Contact" required className="border px-3 py-2 rounded" />
            <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded hover:bg-indigo-700 col-span-full md:col-auto">
              Add Student
            </button>
          </form>
        </div>

        {/* Students Table */}
        <div className="bg-white p-6 rounded shadow w-full max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#3b82f6 transparent" }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Students Data</h2>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-indigo-100 text-indigo-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Sex</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Parents</th>
                <th className="px-4 py-2 text-left">Parent Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}>
                  <td className="px-4 py-2 font-medium">{student.name}</td>
                  <td className="px-4 py-2">{student.sex}</td>
                  <td className="px-4 py-2">{student.class_assigned}</td>
                  <td className="px-4 py-2">{student.parent}</td>
                  <td className="px-4 py-2">{student.contact}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No student found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StudentPage;
