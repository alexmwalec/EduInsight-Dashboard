import { useState } from "react";
import Logo from "../Photos/Logo.jpg"
import { Link } from "react-router-dom";

const TeacherLogIn = () => {
  const [FullName, setFullName] = useState('');
  const [ClassAssigned, setClassAssigned] = useState('');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem('loginLog')) || []);

  const handleLogin = (e) => {
    e.preventDefault();

    const entry = {
      FullName,
      time: new Date().toLocaleString(),
      status: password === 'edu123' ? 'Success' : 'Failed'
    };

    const updatedLog = [entry, ...log];
    setLog(updatedLog);
    localStorage.setItem('loginLog', JSON.stringify(updatedLog));

    if (entry.status === 'Success') {
      alert('Welcome to EduInsight!');
      // Navigate to dashboard if using React Router
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-700 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-gray-800">
        <div className="flex flex-col items-center mb-6"> {/* Changed to flex-col */}
          <div className="border rounded-full w-[110px] h-[110px] border-black overflow-hidden mb-4"> {/* Added mb-4 for spacing */}
            <img 
              src={Logo} 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-2xl font-bold">
           <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
            Thando Academy </span><br/> 
           Education Dashboard<br/>
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="FullName"
            placeholder="FullName"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="ClassAssigned"
            placeholder="AssignedClass"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={ClassAssigned}
            onChange={(e) => setClassAssigned(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Log In
          </button>
          <div className="text-black mt-4 text-left">
           Don't have an account? {''}
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