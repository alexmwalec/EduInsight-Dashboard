import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Photos/Logo.jpg";
import { FaBell, FaChevronDown } from "react-icons/fa";

const TeacherDetailsPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (stored) {
      setTeacher(JSON.parse(stored));
    }
  }, []);

  const getLastName = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : teacher.full_name;
  };

  const getInitials = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.map(p => p[0]).join("").toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="border rounded-full w-[100px] h-[100px] border-white overflow-hidden">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-semibold mt-2">Thando Academy</h1>
        </div>
        <nav className="space-y-9 mt-6">
          <Link to="/" className="block w-full text-left hover:text-indigo-300 font-semibold">Dashboard</Link>
          <Link to="/studentpage" className="block w-full text-left hover:text-indigo-300">Students</Link>
          <Link to="/attendance" className="block w-full text-left hover:text-indigo-300">Attendance</Link>
          <Link to="/grades" className="block w-full text-left hover:text-indigo-300">Grades</Link>
          <Link to="/performance" className="block w-full text-left hover:text-indigo-300">Performance</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {teacher && teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt="Teacher"
                  className="w-10 h-10 rounded-full object-cover border border-indigo-700"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-700 text-white font-bold"
                >
                  {getInitials()}
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

        {/* Teacher Details Card */}
        <section className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Teacher Details</h2>

          {teacher ? (
            <div className="flex gap-10">
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt="Teacher"
                  className="w-36 h-36 object-cover rounded-md border border-gray-300"
                />
              ) : (
                <div className="w-36 h-36 bg-gray-300 rounded-md flex items-center justify-center text-gray-600">
                  <span>Photo Not Available</span>
                </div>
              )}
              <div className="space-y-3 text-gray-700 text-lg">
                <p><strong>Full Name:</strong> {teacher.full_name}</p>
                <p><strong>Subject:</strong> {teacher.subject}</p>
                <p><strong>Class Assigned:</strong> {teacher.class_assigned}</p>
                <p><strong>Joined:</strong> {teacher.created_at ? new Date(teacher.created_at).toDateString() : "Not specified"}</p>
                <p><strong>Contact:</strong> +265 997 XXX XXX</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">Loading teacher data...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherDetailsPage;
