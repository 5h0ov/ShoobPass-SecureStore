import {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import { useStore } from './store/store.js'
import { useDispatch, useSelector } from 'react-redux';
import { login, signup, updateUser, getAuth } from './redux/auth/authSlice.js';


const UserCheck = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);   // value needs to come from backend to check if user is logged in or not
  return (
    <div>
      <h1>Check User</h1>
    </div>
  )
}

export default UserCheck;