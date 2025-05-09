import React, { useEffect, useState } from 'react';
import Logo from "../Photos/Logo.jpg";
import TeacherPhoto from "../Photos/TeacherPhoto.jpg"
import { Link } from "react-router-dom";
import { FaBell, FaChevronDown } from "react-icons/fa";

// Simulated teacher's assigned class
const assignedClass = "Form 2";

const studentsList = [
  'Chisomo Mwale', 'Jane Zikambe', 'Gabriel Moyo', 'Bertha Phiri', 'Thando Chirwa',
  'Doreen Chisale', 'Yamikan Gondwe', 'Stasha Namakhwa', 'Peter Banda', 'Grace Mvula',
  'Lonjezo Kaira', 'Martha Phiri', 'Joshua Kaunda', 'Linda Jere', 'Brighton Zimba',
  'Fanny Malizani', 'James Chimwala', 'Nancy Mwansa', 'Blessings Tembo', 'Esther Kalua',
  'Andrew Chikondi', 'Mirriam Chirwa', 'Jonathan Nyirenda', 'Lucia Kasambara', 'Kelvin Kumwenda'
];

const AttendancePage = () => {
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setAttendance(
      studentsList.map((student) => ({
        name: student,
        status: '',
      }))
    );
  }, []);

  const handleStatusChange = (index, status) => {
    const updated = [...attendance];
    updated[index].status = status;
    setAttendance(updated);
  };

  const handleSave = () => {
    if (!date) {
      alert('Please select a date.');
      return;
    }

    console.log({
      class: assignedClass,
      date,
      attendance,
    });

    alert('Attendance saved (check console).');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-7 space-y-6">
        <div className="border rounded-full w-[110px] h-[110px] border-white overflow-hidden mb-2 mx-auto">
          <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-center text-2xl font-bold">Thando Academy</div>
        <nav className="space-y-6 mt-6">
          <Link to="/" className="block w-full text-left hover:text-indigo-200">Dashboard</Link>
          <Link to="/studentpage" className="block w-full text-left hover:text-indigo-200">Students</Link>
          <Link to="/attendance" className="block w-full text-left font-semibold text-white">Attendance</Link>
          <Link to="/grades" className="block w-full text-left hover:text-indigo-200">Grades</Link>
          <Link to="/performance" className="block w-full text-left hover:text-indigo-200">Performance</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
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
                className={`text-indigo-700 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
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
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Attendance form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Attendance Sheet</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Class</label>
              <div className="text-gray-900 font-semibold">{assignedClass}</div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div
            className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-300 rounded"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 transparent',
            }}
          >
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0 text-sm font-semibold text-gray-700 z-10">
                  <th className="p-2 border">Student Name</th>
                  <th className="p-2 border text-center">Present</th>
                  <th className="p-2 border text-center">Absent</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((student, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-50 border-t text-sm">
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border text-center">
                      <input
                        type="radio"
                        name={`status-${index}`}
                        checked={student.status === 'Present'}
                        onChange={() => handleStatusChange(index, 'Present')}
                      />
                    </td>
                    <td className="p-2 border text-center">
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
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Save Attendance
          </button>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
