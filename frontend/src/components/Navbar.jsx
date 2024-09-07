import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaGithub } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import { LuLogOut } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/auth/authSlice.js';
import { toast } from 'react-toastify';


const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isAuthPage, setIsAuthPage] = useState(false);

    useEffect(() => {
        setIsAuthPage(location.pathname === '/login' || location.pathname === '/signup');
    }, [location]);


    const { user, isLoggingIn, checkingAuth } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null); // to handle if user clicks outside the dropdown
    const [theme, setTheme] = useState(localStorage.getItem('theme'));


    
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
 }, [dropdownOpen]);
  

    const handleLogOut = () => {
        if(user){
            dispatch(logout())
        }else{
            toast.error('You are not logged in');
        }
        toggleDropdown();
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }, [theme]);
    
      const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      };
    

  return (
    <nav className='bg-purple-200 '>
        <div className="flex mycontainer justify-between px-4 py-5 items-center">

        <Link className="logo font-bold text-2xl group cursor-pointer" to="/" >
            <span className='text-green-700 group-hover:text-black'>&lt;</span>
            <span className='group-hover:text-green-700'>Shoob</span>
            <span className='text-green-700 group-hover:text-black'>Pass/&gt;</span>
        </Link>

         <div className={`relative md:hidden ${isAuthPage ? 'hidden' : ''}`} ref={dropdownRef}>
                        <span className="avatar cursor-pointer" onClick={toggleDropdown}>
                            <RxAvatar className='flex size-10  sm:mb-0 rounded cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out ' id='avatar' />
                            <Tooltip anchorSelect='#avatar' place='bottom'>User</Tooltip>
                        </span>
                        
                    {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                                    {checkingAuth ? (
                            <div className="py-1">
                                <span className="flex items-center px-4 py-2 text-gray-700">
                                    Please Wait...
                                </span>
                            </div>
                        ) : user ? (
                            <div className="py-1">
                                <span className="log-out flex items-center px-4 py-2 text-gray-700">
                                    {`Hello ${user.username},`}
                                </span>
                                <span className="log-out flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>
                                    <LuLogOut className='mr-2' /> Log Out
                                </span>
                            </div>
                        ) : (
                            <div className="py-1">
                                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>Login</Link>
                                <Link to="/signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>Sign Up</Link>
                            </div>
                        )}
                                </div>
                    )}
        </div> 

        <div className="md:hidden">
                    <button onClick={toggleMobileMenu}>
                        {!mobileMenuOpen ? <GiHamburgerMenu size={24} /> : <GiHamburgerMenu size={24} className='rotate-90 transition-all duration-100 ease-in-out' />}
                    </button>
        </div>

        <ul className='md:flex flex-row gap-4 text-lg font-semibold hidden'>
            <li>
                <Link className='hover:font-bold hover:underline' to='/'>Home</Link>
            </li>
            <li>
                <Link className='hover:font-bold hover:underline' to='/about'>About</Link>
            </li>
            <li>
                <Link className='hover:font-bold hover:underline' to='/contact'>Contact</Link>
            </li>
            <li className={`relative ${isAuthPage ? 'hidden' : ''}`} ref={dropdownRef}>
                        <span className="avatar cursor-pointer" onClick={toggleDropdown}>
                            {/* Replace with your avatar component */}
                            <RxAvatar className='flex size-10  sm:mb-0 rounded cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out ' id='avatar' />
                            <Tooltip anchorSelect='#avatar' place='bottom'>User</Tooltip>
                        </span>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                                {user ? (
                                    <div className="py-1">
                                        <span className="log-out flex items-center px-4 py-2 text-gray-700">
                                           {`Hello ${user.username},`}
                                        </span>
                                        <span className="log-out flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>
                                            <LuLogOut className='mr-2' /> Log Out
                                        </span>
                                    </div>
                                ) : (
                                    <div className="py-1">
                                        <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>Login</Link>
                                        <Link to="/signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>Sign Up</Link>
                                    </div>
                                )}
                            </div>
                        )}
            </li>
            {/* <li>
                <Tooltip anchorSelect=".log-out" place="bottom" content='Log Out' />
                <span className="log-out hover:scale-125 transition duration-100 ease-in-out text-xl cursor-pointer" onClick={handleLogOut}>
                    <LuLogOut className='size-10' />
                </span>

            </li> */}
        <li className="flex items-center">
          <button id='theme-toggle'
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 active:bg-black hover:scale-110 transition-all duration-150 ease-in-out "
          >
            {theme === 'light' ? '🌜' : '🌞'}
          </button>
          <Tooltip anchorSelect='#theme-toggle' place='bottom'>Change Theme to {theme==='light' ? 'Dark' : 'Light'}</Tooltip>
        </li>

            <li className='flex flex-row gap-2 px-2 py-2 ml-0 rounded-md bg-blue-950 text-white  hover:bg-slate-900'>
                <Link className='flex flex-row gap-2' to='https://github.com/5h0ov/ShoobPass-SecureStore' target='_blank'>
                    <FaGithub className='hover:scale-110 transition-all duration-150 ease-in-out size-7'/><span>Contribute Here!</span>
                </Link>
            </li>
        </ul>

        {mobileMenuOpen && (
                <div className="absolute right-0 mt-72 w-48 bg-white border rounded-md shadow-lg">

                    <div className="py-1">
                        {!isLoggingIn ? (
                            <>
                            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" >Home</Link>
                            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" >About</Link>
                            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" >Contact Us</Link>
                            <Link className='flex flex-row gap-2 justify-center mt-6' to='https:\\www.hi.com' target='_blank'>
                            <FaGithub className='hover:scale-110 transition-all duration-150 ease-in-out size-7'/><span>Contribute Here!</span>
                            </Link>
                            <div className="flex items-center  justify-center mt-4 mb-2">
                                <button id='theme-toggle'
                                    onClick={toggleTheme}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 active:bg-black hover:scale-110 transition-all duration-150 ease-in-out "
                                >
                                    {theme === 'light' ? '🌜' : '🌞'}
                                </button>
                                <Tooltip anchorSelect='#theme-toggle' place='bottom'>Change Theme to {theme==='light' ? 'Dark' : 'Light'}</Tooltip>
                            </div>

                            </>
                    ) : (
                        <Link className='flex flex-row gap-2' to='https:\\www.hi.com' target='_blank'>
                        <FaGithub className='hover:scale-110 transition-all duration-150 ease-in-out size-7'/><span>Contribute Here!</span>
                        </Link>
                    )}
                        

                    </div>
                
            </div>
        )}
        </div>

    </nav>
  )
}

export default Navbar