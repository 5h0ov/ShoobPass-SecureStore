import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/auth/authSlice.js';
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isLoggingIn } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault(); // prevents the page from refreshing
    try {
      const res = await dispatch(login({ email, password })).unwrap();  // without unwrap we will have to manually get payload and would need to know action's fulfilled and rejected states manually, unwrap here simplifies this by directly giving you the payload or throwing an error

      // console.log('Login Successful');
      // console.log("res: ", res);
      // console.log("user: ", user);
      navigate('/');
    } catch (error) {
      console.log('Login failed:', error);
      toast.error(error);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen min-w-[240px] bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={email}
              placeholder="JohnDoe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">Don't have an account? <Link to={`/signup?email=${email}`} className="text-purple-500 hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login