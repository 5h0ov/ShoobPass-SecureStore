import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/auth/authSlice.js';


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
    }
  };


  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="form flex items-center justify-center mt-20 mx-3">
          <div className="w-full max-w-md space-y-6 p-8 bg-black/50 rounded-lg shadow-md">
            <h1 className='text-white text-center font-bold text-3xl mb-4'>
              Log In
            </h1>

            <form className='space-y-5' onSubmit={handleLogin} >
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

              <button className='text-white bg-red-600 rounded-md w-full py-2 font-semibold hover:bg-red-700 active:bg-red-900'>Login</button>
            </form>

            <div className="member text-center text-gray-300">
              Don't Have an Account? {/* <br/> */}
            </div>

            <Link to={`/signup?email=${email}`}  className='text-red-500 hover:underline flex justify-center items-center font-semibold  mt-0'> 
                Sign Up
              </Link>

          </div>
        </div>
    </>
  )
}

export default Login