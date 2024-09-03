import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Manage from '../components/Manage.jsx'
import { getThemePreference } from '../utils/theme.js'

const Home = () => {
  const theme = getThemePreference();

  return (
    <div >
      {theme === 'dark' ? 
      <div className="absolute top-0 z-[-2] h-screen w-full bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))]"></div> 
      : 
      <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>}
      <Manage />
    </div>  
  )
}

export default Home