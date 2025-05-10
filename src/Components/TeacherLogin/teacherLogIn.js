import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../Photos/Logo.jpg";

const TeacherLogIn = () => {
  const [fullName, setFullName] = useState('');
  const [classAssigned, setClassAssigned] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          class_assigned: classAssigned,
          subject,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("teacher", JSON.stringify(data.teacher));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-700 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="border rounded-full w-[110px] h-[110px] border-black overflow-hidden mb-4">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
              Thando Academy
            </span>
            <br />
            Education Dashboard
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Assigned Class"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            value={classAssigned}
            onChange={(e) => setClassAssigned(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogIn;
