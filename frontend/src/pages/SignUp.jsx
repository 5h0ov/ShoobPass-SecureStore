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
      console.log("res: ", res);
      navigate('/');
    } catch (error) {
      console.log('Signup failed:', error);
    }
  };


  return (
    <>
    <div className="absolute top-0 z-[-2] h-screen w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    
    <div className="form flex items-center justify-center mt-20 mx-3">
    <div className="w-full max-w-md space-y-6 p-8 bg-black/50 rounded-lg shadow-md">
      <h1 className='text-white text-center font-bold text-3xl mb-4'>
        Sign Up
      </h1>

      <form className='space-y-5'onSubmit={handleSignUp} >
          <div>
            <label htmlFor="username" className='text-base text-gray-200 font-medium block'>
              Username
            </label>
            <input type="username" id='username'
             className='w-full mt-1 text-white force:outline-none focus:ring-2 border bg-transparent border-gray-600 rounded-md px-3 py-1' placeholder='JohnDoe' value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className='text-base text-gray-200 font-medium block'>
              Email
            </label>
            <input type="email" id='email'
             className='w-full mt-1 text-white force:outline-none focus:ring-2 border bg-transparent border-gray-600 rounded-md px-3 py-1' placeholder='JohnDoe@gmail.com' value={email} 
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          
          <div>
            <label htmlFor="password" className='text-base text-gray-200 font-medium block'>
              Password
            </label>
            <input type="password" id='password'
             className='w-full mt-1 text-white force:outline-none focus:ring-2 border bg-transparent border-gray-600 rounded-md px-3 py-1' placeholder='••••••••' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
        <button className='text-white bg-red-600 rounded-md w-full py-2 font-semibold hover:bg-red-700 active:bg-red-900'>Sign Up</button>
      </form>

      <div className="member text-center text-gray-300">
        Already Have an Account? {/* <br/> */}
      </div>

      <Link to="/login" className='text-red-500 hover:underline flex justify-center items-center font-semibold  mt-0'> 
          Log In
        </Link>

    </div>
  </div>
  </>
  )
}

export default SignUp