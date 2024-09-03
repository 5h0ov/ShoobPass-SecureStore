import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import Page404 from './pages/Page404'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import 'react-tooltip/dist/react-tooltip.css'
import './App.css'
import Login from './pages/Login.jsx'
import SignUp  from './pages/SignUp.jsx'
import Page404 from './pages/Page404.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from './redux/auth/authSlice.js';
import { setThemePreference, getThemePreference } from './utils/theme.js';


function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch]);
  if(!localStorage.getItem('theme')){
    setThemePreference();
  }

  const theme = getThemePreference();
  console.log('theme:', theme);

  return (
    <div className="dark:bg-black dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))]">
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition: Bounce
      />
  
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={!user? <Login/> : < Navigate to={"/"} /> }/>
        <Route path='/signup' element={!user? <SignUp/> : < Navigate to={"/"} />}/>
        <Route path='*' element={<Page404 />} />
      </Routes>
      <Footer />
      
    </div>
  )
}

export default App
