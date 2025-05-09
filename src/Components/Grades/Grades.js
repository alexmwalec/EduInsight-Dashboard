import React, { useState } from "react";
import { Link } from "react-router-dom";
import TeacherPhoto from "../Photos/TeacherPhoto.jpg"
import { FaBell, FaChevronDown } from "react-icons/fa";
import Logo from "../Photos/Logo.jpg";

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({ name: "", score: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", score: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.score) return;
    setGrades([...grades, form]);
    setForm({ name: "", score: "" });
  };

  const handleDelete = (index) => {
    const updated = [...grades];
    updated.splice(index, 1);
    setGrades(updated);
    if (editIndex === index) setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(grades[index]);
  };

  const handleSave = (index) => {
    const updated = [...grades];
    updated[index] = editForm;
    setGrades(updated);
    setEditIndex(null);
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
          <Link to="/" className="block w-full text-left hover:text-indigo-300">Dashboard</Link>
          <Link to="/studentpage" className="block w-full text-left hover:text-indigo-300">Students</Link>
          <Link to="/attendance" className="block w-full text-left hover:text-indigo-300">Attendance</Link>
          <Link to="/grades" className="block w-full text-left hover:text-indigo-300 font-semibold">Grades</Link>
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

        {/* Grade Entry Section */}
        <section className="bg-white p-4 rounded-2xl shadow mb-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">Enter Mathematics Grades</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="number"
              name="score"
              placeholder="Math Score"
              value={form.score}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md"
            />
            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Grade
            </button>
          </form>
        </section>

        {/* Display Grades */}
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">Submitted Grades - Math</h2>
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
                    <td className="py-2 px-4">
                      {editIndex === idx ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-1 rounded w-full"
                        />
                      ) : (
                        g.name
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editIndex === idx ? (
                        <input
                          type="number"
                          name="score"
                          value={editForm.score}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-1 rounded w-full"
                        />
                      ) : (
                        g.score
                      )}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      {editIndex === idx ? (
                        <button
                          onClick={() => handleSave(idx)}
                          className="text-green-600 hover:underline"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(idx)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-red-600 hover:underline"
                      >
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
