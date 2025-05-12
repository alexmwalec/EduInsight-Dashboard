import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import StudentPieChart from "../StudentPieChart/StudentPieChart";
import Logo from "../Photos/Logo.jpg";
import PerformanceChart from "../PerformanceChart/PerformanceChart";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaChevronDown } from "react-icons/fa";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaBook,
  FaChartLine,
} from "react-icons/fa";
const TeacherDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      const parsedTeacher = JSON.parse(storedTeacher);
      setTeacher(parsedTeacher);

      fetch(`http://localhost:5000/api/students?class_assigned=${encodeURIComponent(parsedTeacher.class_assigned)}`)
        .then(res => res.json())
        .then(data => {
          setStudentList(data);
        })
        .catch(err => console.error("Failed to fetch students:", err));
    }
  }, []);

  const studentsWithDisabilities = studentList.filter(s => s.has_disability === true);
  const numberOfBoys = studentList.filter(s => s.sex === "M").length;
  const numberOfGirls = studentList.filter(s => s.sex === "F").length;
  const totalStudents = studentList.length;

  const stats = [
    { label: "Total number of students", count: totalStudents, color: "text-indigo-600", type: "total" },
    { label: "Number of Boys", count: numberOfBoys, color: "text-blue-500", type: "boys" },
    { label: "Number of Girls", count: numberOfGirls, color: "text-pink-500", type: "girls" },
    { label: "Students with Disabilities", count: studentsWithDisabilities.length, color: "text-red-500", type: "disabilities" }
  ];

  const getLastName = () => {
    if (!teacher) return "";
    const parts = teacher.full_name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : teacher.full_name;
  };

  const getInitials = () => {
    if (!teacher?.full_name) return "";
    return teacher.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const notifications = [
    { date: "10 Feb, 2025", message: "Average class performance in maths dropped by 10% compared to last week." },
    { date: "07 March, 2025", message: "Student James Phiri has missed 3 consecutive days of school." },
    { date: "15 March, 2025", message: "Term-end test scheduled for Science on 20 March." },
    { date: "22 March, 2025", message: "Parent-teacher meeting for Form 2 is set for 25 March." },
    { date: "04 April, 2025", message: "You have not updated attendance for Form 2 for 2 weeks." }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
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

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {teacher?.profile_image_url ? (
                <img
                  src={teacher.profile_image_url}
                  alt="Teacher"
                  className="w-10 h-10 rounded-full object-cover border border-indigo-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center text-sm font-semibold border border-indigo-700">
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

        {/* Top Stats */}
        <section className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((card, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCard(card)}
              className="bg-white p-4 rounded shadow text-center cursor-pointer hover:scale-105 transform transition-transform duration-300"
            >
              <FaUser className={`mx-auto ${card.color} mb-2`} size={28} />
              <p className="text-2xl font-bold">{card.count}</p>
              <p className="text-sm text-gray-600">{card.label}</p>
            </div>
          ))}
        </section>

        {/* Charts & Notifications */}
        <section className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 text-indigo-700">Students</h3>
            <div className="h-48">
              <StudentPieChart boys={numberOfBoys} girls={numberOfGirls} />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 text-indigo-700">Notifications</h3>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
              {notifications.map((note, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-1 bg-gray-50 rounded-md shadow-sm">
                  <span className="text-sm font-semibold text-teal-600">{note.date}</span>
                  <p className="text-sm text-gray-700">{note.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance & Calendar */}
        <section className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 text-indigo-700">Students Performance</h3>
            <div className="h-48">
              <PerformanceChart />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Calendar</h3>
            <Calendar />
          </div>
        </section>

        {/* Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[320px] text-center relative">
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-2">{selectedCard.label}</h2>
              <p className="text-3xl text-indigo-700 font-semibold mb-4">{selectedCard.count}</p>

              {selectedCard.type === "disabilities" ? (
                <ul className="text-left text-sm text-gray-700 list-disc list-inside">
                  {studentsWithDisabilities.map((student, i) => (
                    <li key={i}>{student.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  {selectedCard.label.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
