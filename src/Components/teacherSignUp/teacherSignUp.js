import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../Photos/Logo.jpg";

const TeacherSignUp = () => {
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [classAssigned, setClassAssigned] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // ✅ for redirecting after success

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          class_assigned: classAssigned,
          subject: subject,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Clear inputs
        setFullName("");
        setClassAssigned("");
        setSubject("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        // ✅ Redirect to login
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error, try again later");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-700 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="border rounded-full w-[110px] h-[110px] border-black overflow-hidden mb-4">
            <img 
              src={Logo} 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
              Thando Academy
            </span><br/> 
            Education Dashboard<br/>
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name*"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Subject You Teach*"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            type="text"
            placeholder="Assigned Class*"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={classAssigned}
            onChange={(e) => setClassAssigned(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password* (min 6 characters)"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password*"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Sign Up
          </button>

          <div className="text-black mt-4 text-left">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherSignUp;
