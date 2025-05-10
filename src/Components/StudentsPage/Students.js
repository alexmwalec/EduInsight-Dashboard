import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TeacherPhoto from "../Photos/TeacherPhoto.jpg";
import Logo from "../Photos/Logo.jpg";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";

const StudentPage = () => {
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();
      setStudentList(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const newStudent = {
      name: e.target.name.value,
      sex: e.target.sex.value,
      class_assigned: e.target.class_assigned.value,
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
        fetchStudents(); // Refresh the student list
      } else {
        console.error("Failed to add student.");
      }
    } catch (err) {
      console.error("Failed to add student:", err);
    }
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
        <nav className="space-y-9 mt-6">
          <Link to="/" className="block w-full text-left hover:text-indigo-300">Dashboard</Link>
          <Link to="/studentpage" className="block w-full text-left hover:text-indigo-300 font-semibold">Students</Link>
          <Link to="/attendance" className="block w-full text-left hover:text-indigo-300">Attendance</Link>
          <Link to="/grades" className="block w-full text-left hover:text-indigo-300">Grades</Link>
          <Link to="/performance" className="block w-full text-left hover:text-indigo-300">Performance</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={TeacherPhoto}
                alt="Teacher"
                className="w-10 h-10 rounded-full object-cover border border-indigo-700"
              />
              <span className="ml-2">Mr. Chisomo Mwale</span>
              <FaChevronDown
                className={`text-indigo-700 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
              <FaBell className="text-indigo-700 ml-3" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link to="/teacherdetails" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Teacher Details</Link>
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Logout</Link>
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
            <input name="class_assigned" type="text" placeholder="Class" required className="border px-3 py-2 rounded" />
            <input name="parent" type="text" placeholder="Parent's Name" required className="border px-3 py-2 rounded" />
            <input name="contact" type="text" placeholder="Parent Contact" required className="border px-3 py-2 rounded" />
            <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded hover:bg-indigo-700 col-span-full md:col-auto">Add Student</button>
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
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">No student found.</td>
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
