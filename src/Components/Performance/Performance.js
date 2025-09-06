import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown, FaHome, FaUserGraduate, FaClipboardList, FaBook, FaChartLine } from "react-icons/fa";
import Logo from "../Photos/Logo.jpg";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const PerformancePage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  // Fetch teacher info and grades
  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      const t = JSON.parse(storedTeacher);
      setTeacher(t);
      fetchGrades(t.class_assigned);
    }
  }, []);

  const fetchGrades = async (class_assigned) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/grades/class?class_assigned=${class_assigned}`);
      setGrades(res.data || []);
    } catch (err) {
      console.error("Failed to fetch grades:", err);
    }
  };

  const getLastName = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : teacher.full_name;
  };

  const getInitials = () => {
    if (!teacher?.full_name) return "";
    return teacher.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Prepare chart data safely
  const weeks = [...new Set(grades.map(g => g.week))].sort((a, b) => a - b);

  const boysScores = weeks.map(week => {
    const weekGrades = grades.filter(g => g.week === week && g.sex === "Male");
    if (weekGrades.length === 0) return 0;
    return weekGrades.reduce((sum, g) => sum + g.score, 0) / weekGrades.length;
  });

  const girlsScores = weeks.map(week => {
    const weekGrades = grades.filter(g => g.week === week && g.sex === "Female");
    if (weekGrades.length === 0) return 0;
    return weekGrades.reduce((sum, g) => sum + g.score, 0) / weekGrades.length;
  });

  const lineData = {
    labels: weeks.map(w => `Week ${w}`),
    datasets: [
      {
        label: "Boys",
        data: boysScores,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
      {
        label: "Girls",
        data: girlsScores,
        borderColor: "#ec4899",
        backgroundColor: "#ec4899",
        tension: 0.3,
      },
    ],
  };

  // Average score per subject
  const subjects = [...new Set(grades.map(g => g.subject))];
  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Average Score",
        data: subjects.map(subj => {
          const subjectGrades = grades.filter(g => g.subject === subj);
          if (subjectGrades.length === 0) return 0;
          return subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
        }),
        backgroundColor: "#6366f1",
      },
    ],
  };

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
          <Link to="/" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaHome /> Dashboard</Link>
          <Link to="/studentpage" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaUserGraduate /> Students</Link>
          <Link to="/attendance" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaClipboardList /> Attendance</Link>
          <Link to="/grades" className="flex items-center gap-3 text-lg hover:text-indigo-300"><FaBook /> Grades</Link>
          <Link to="/performance" className="flex items-center gap-3 text-lg hover:text-indigo-300 font-semibold"><FaChartLine /> Performance</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold bg-indigo-700">{getInitials()}</div>
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

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Performance Overview</h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Boys vs Girls Weekly Performance</h3>
            <div className="h-64">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Scores by Subject</h3>
            <div className="h-64">
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;
