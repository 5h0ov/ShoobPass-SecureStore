import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signup, getAuth } from '../redux/auth/authSlice.js';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const windowUrl = window.location.search;  // gets the query string from the url
  const searchParams = new URLSearchParams(windowUrl);  // creates a new URLSearchParams object
  const emailValue = searchParams.get("email"); // gets the value of the email parameter from the query string
  const [email, setEmail] = useState(emailValue || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault(); // prevents the page from refreshing
    try {
      const res = await dispatch(signup({ username, email, password })).unwrap();  // without unwrap we will have to manually get payload and would need to know action's fulfilled and rejected states manually, unwrap here simplifies this by directly giving you the payload or throwing an error

      console.log('Signup Successful');
      navigate('/');
    } catch (error) {
      console.log('Signup failed:', error);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Sign Up</h1>
        <form className="space-y-5" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="JohnDoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="JohnDoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">Already have an account? <Link to="/login" className="text-purple-500 hover:underline">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp