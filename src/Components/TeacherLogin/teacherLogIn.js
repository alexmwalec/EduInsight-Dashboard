import { useState } from "react";
import Logo from "../Photos/Logo.jpg";
import { Link } from "react-router-dom";

const TeacherLogIn = () => {
  const [FullName, setFullName] = useState('');
  const [ClassAssigned, setClassAssigned] = useState('');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem('loginLog')) || []);

  const handleLogin = (e) => {
    e.preventDefault();

    // For now, always treat login as successful (bypass validation)
    const entry = {
      FullName,
      ClassAssigned,
      time: new Date().toLocaleString(),
      status: 'Success (Bypassed)'
    };

    const updatedLog = [entry, ...log];
    setLog(updatedLog);
    localStorage.setItem('loginLog', JSON.stringify(updatedLog));

    alert('Welcome to EduInsight!');
    // TODO: Navigate to dashboard when backend is ready
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
          <h1 className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
              Thando Academy
            </span><br/>
            Education Dashboard
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Assigned Class"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={ClassAssigned}
            onChange={(e) => setClassAssigned(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
          <Link to="/" className="text-white hover:text-indigo-800 font-medium">
           Log In
        </Link>
          
          </button>
          <div className="text-black mt-4 text-left">
            Don't have an account?{" "}
            <Link to="/Signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogIn;
