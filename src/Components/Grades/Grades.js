import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown, FaHome, FaUserGraduate, FaClipboardList, FaBook, FaChartLine } from "react-icons/fa";
import Logo from "../Photos/Logo.jpg";

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({ name: "", score: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch teacher info and grades
  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      const parsedTeacher = JSON.parse(storedTeacher);
      setTeacher(parsedTeacher);
      fetchGrades(parsedTeacher.class_assigned);
    }
  }, []);

  const fetchGrades = async (class_assigned) => {
    try {
      const res = await fetch(`http://localhost:5000/api/grades/class?class_assigned=${class_assigned}`);
      const data = await res.json();
      setGrades(data);
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  // Utility functions
  const getLastName = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : teacher.full_name;
  };

  const getInitials = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Form handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.score || !teacher?.class_assigned || !teacher?.subject) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: form.name,
          subject: teacher.subject,
          score: parseFloat(form.score),
          class_assigned: teacher.class_assigned
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to submit grade");
        return;
      }

      setGrades(prev => [...prev, data]);
      setForm({ name: "", score: "" });
      setMessage("");
    } catch (err) {
      console.error("Error submitting grade:", err);
      setMessage("Server error");
    }
  };

  // Delete grade
  const handleDelete = async (student_name, subject, class_assigned) => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/grades", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_name, subject, class_assigned })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to delete grade");
        return;
      }

      setMessage(data.message || "");
      fetchGrades(class_assigned);
    } catch (err) {
      console.error("Error deleting grade:", err);
      setMessage("Server error");
    }
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
        <nav className="flex-1 p-6 space-y-6">
          <Link to="/" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaHome /> Dashboard</Link>
          <Link to="/studentpage" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaUserGraduate /> Students</Link>
          <Link to="/attendance" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaClipboardList /> Attendance</Link>
          <Link to="/grades" className="flex items-center gap-3 text-lg hover:text-indigo-300 font-semibold"><FaBook /> Grades</Link>
          <Link to="/performance" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaChartLine /> Performance</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold bg-indigo-700">
                {teacher ? getInitials() : "?"}
              </div>
              <span className="ml-2">{teacher ? `Mr. ${getLastName()}` : "Loading..."}</span>
              <FaChevronDown className={`text-indigo-700 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              <FaBell className="text-indigo-700 ml-3" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link to="/teacherdetails" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Teacher Details</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Message */}
       

        {/* Grade Entry Form */}
        <section className="bg-white p-4 rounded-2xl shadow mb-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">Grades Section</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="name" placeholder="Student Name" value={form.name} onChange={handleChange} className="border border-gray-300 p-2 rounded-md" />
            <input type="number" name="score" placeholder="Score" value={form.score} onChange={handleChange} className="border border-gray-300 p-2 rounded-md" />
            <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit Grade</button>
          </form>
        </section>

        {/* Grade Table */}
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">Grades for {teacher?.subject}</h2>
          {grades.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-4">Student</th>
                  <th className="py-2 px-4">Score</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {grades.map((g, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{g.student_name}</td>
                    <td className="py-2 px-4">{g.score}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => handleDelete(g.student_name, teacher.subject, teacher.class_assigned)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No grades submitted yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default GradePage;
