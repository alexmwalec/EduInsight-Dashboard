import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../Photos/Logo.jpg";
import { FaChevronDown, FaBell } from "react-icons/fa";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaBook,
  FaChartLine,
} from "react-icons/fa";


const AttendancePage = () => {
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const teacherInfo = JSON.parse(localStorage.getItem('teacher'));
  const assignedClass = teacherInfo?.class_assigned || '';
  const teacherFullName = teacherInfo?.full_name || '';

  const getLastName = () => {
    if (!teacherFullName) return "";
    const parts = teacherFullName.trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1] : teacherFullName;
  };

  const getInitials = () => {
    if (!teacherFullName) return "";
    const parts = teacherFullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/students?class_assigned=${assignedClass}`);
        const data = await res.json();
        setStudents(data);
        setAttendance(data.map(s => ({ student_id: s.id, name: s.name, status: '' })));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (assignedClass) fetchStudents();
  }, [assignedClass]);

  const handleStatusChange = (index, status) => {
    const updated = [...attendance];
    updated[index].status = status;
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (!date) return alert('Please select a date.');

    try {
      const res = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          class_assigned: assignedClass,
          records: attendance.map(({ student_id, status }) => ({ student_id, status }))
        }),
      });

      const data = await res.json();
      if (res.ok) alert(data.message);
      else throw new Error(data.message);
    } catch (err) {
      console.error('Failed to save attendance:', err);
      alert('Error saving attendance.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    navigate("/login");
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
      <main className="flex-1 p-6 bg-gray-100">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <div className="relative">
            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold">
                {getInitials()}
              </div>
              <span>Mr. {getLastName()}</span>
              <FaChevronDown className="text-indigo-700" />
              <FaBell className="text-indigo-700 ml-2" />
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded z-50">
                <Link to="/teacherdetails" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Teacher Details</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Attendance Form */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold text-indigo-700 mb-4">Attendance Sheet</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Class</label>
              <div>{assignedClass}</div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-indigo-100 text-left text-sm font-semibold text-gray-700">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2 text-center">Present</th>
                <th className="border px-4 py-2 text-center">Absent</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((student, index) => (
                <tr key={student.student_id} className="bg-white hover:bg-gray-50 text-sm">
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`status-${index}`}
                      checked={student.status === 'Present'}
                      onChange={() => handleStatusChange(index, 'Present')}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`status-${index}`}
                      checked={student.status === 'Absent'}
                      onChange={() => handleStatusChange(index, 'Absent')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSave}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Save Attendance
          </button>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
