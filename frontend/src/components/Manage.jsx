import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'
import axios from 'axios';
import { MdAddToPhotos } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { FaCloudArrowDown } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js';

const Manage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [tablePasswordVisibility, setTablePasswordVisibility] = useState({});
  const [passwords, setPasswords] = useState([]);
  const [form, setForm] = useState({url: "", user: "", password: ""});
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userRef = useRef(null);
  const urlRef = useRef(null);
  const passwordRef = useRef(null);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);


  const totalPages = Math.ceil(passwords.length / entriesPerPage);
  const currentPasswords = passwords.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when entries per page changes
  };

  const showPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const toggleTablePasswordVisibility = (id) => {
    setTablePasswordVisibility(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  useEffect(() => {
    let passwords = (JSON.parse(localStorage.getItem('passwords'))) || [];
    setPasswords(passwords);
    console.log(passwords);
  }, [user])

  const deleteEntry = () => {
    let newPasswords = passwords.filter((item) => item.id != deleteId);
    localStorage.setItem('passwords', JSON.stringify(newPasswords));
    setPasswords(newPasswords);
    toast.success('Password Deleted Successfully');
    setShowModal(false);
  }

  const editEntry = (id) => {
    let password = passwords.find((item) => item.id === id);
    setForm(password);
    setEditing(true);
    // deleteEntry(id);
    setEditingId(id);
  }

  const cancelEdit = () => {
    setForm({url: '', user: '', password: ''});
    setEditing(false);
    setEditingId(null);
    alert('Edit Cancelled');
  }

  const savePassword = () => {
    if(!form.url || !form.user || !form.password) {
      return toast.error('Please Fill All Fields');
    }
    
    console.log('Password Saved');

    if(passwords) {
      let newPasswords = [...passwords, {...form, id: uuidv4()}];
      if(editing) {
        newPasswords = newPasswords.filter((item) => item.id != editingId);
      }
      localStorage.setItem('passwords', JSON.stringify(newPasswords));
      setPasswords(newPasswords);
      console.log(passwords)
      toast.success('Password Saved Successfully');
    } 
    else {
      console.log('No Passwords Found');
    }

    // if (urlRef.current) urlRef.current.value = '';
    // if (userRef.current) userRef.current.value = '';
    // if (passwordRef.current) passwordRef.current.value = '';
    
    setForm({ url: '', user: '',  password: '' });
    setEditing(false);
    setEditingId(null);
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }
  
  
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };


  const deriveKey = async (password) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const salt = 16; 
    // console.log('Salt:', salt);
    
    const key = await window.crypto.subtle.deriveKey(
      { 
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 1000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    return CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(exportedKey));
  };

  const saveToCloud = async () => {
    if (!user) {
      return toast.error('You need to be logged in to save to cloud');
    }

    const confirm = window.confirm('Do you want to save your entries to the cloud?');
    if (!confirm) return;

    try {
      // console.log('Deriving key...');
      const key = await deriveKey(user.password); // Derive key from user's password
      // console.log('Key derived:', key);

      const encryptedPasswords = passwords.map((entry) => ({
        ...entry,
        password: CryptoJS.AES.encrypt(entry.password, key).toString(),
      }));

      console.log('Encrypted passwords:', encryptedPasswords);
  
      const token = localStorage.getItem('jwt-shoobpass');
      const res = await axios.post(
        `${API_URL}/api/pass/savePasswords`,
        { passwords: encryptedPasswords },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('Response:', res.data);
      toast.success('Passwords saved to cloud successfully');
    } catch (error) {
      if (error.response && error.response.status === 420) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while saving passwords.');
      }
    }
  };

  const retrieveFromCloud = async () => {
    if (!user) {
      return toast.error('You need to be logged in to retrieve from cloud');
    }

    try {
      console.log("user:",user)
      const token = localStorage.getItem('jwt-shoobpass');
      const res = await axios.get(`${API_URL}/api/pass/getPasswords`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response: ",res)
      const key = await deriveKey(user.password); // Derive key from user's password
      // console.log('Response:', user.password);
      // console.log('Key derived:', key);

      const decryptedPasswords = response.data.passwords.map((entry) => ({
        ...entry,
        password: CryptoJS.AES.decrypt(entry.password, key).toString(CryptoJS.enc.Utf8),
      }));
      console.log('Decrypted passwords:', decryptedPasswords);
      setPasswords(decryptedPasswords);
      localStorage.setItem('passwords', JSON.stringify(decryptedPasswords));
      toast.success('Passwords retrieved from cloud successfully');
      
    } catch (error) {
      if (error.response && error.response.status === 420) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while retrieving passwords.');
      }
    }
  };


  
  return (
    <>
    <div className="absolute top-0 z-[-2] h-screen w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

    <div className=" p-3 md:mycontainer min-h-[88.2vh]">
      
    <div className='flex flex-row justify-between font-bold text-lg'>
    <button onClick={saveToCloud} className="bg-purple-200 p-4 rounded-md flex gap-2 hover:bg-purple-300 active:bg-purple-700 border border-gray-600">
        <BsCloudArrowUpFill className='size-8' /> Save to Cloud
    </button>
    <button onClick={retrieveFromCloud} className="bg-purple-200 p-4 rounded-md flex gap-2 hover:bg-purple-300 active:bg-purple-700 border border-gray-600">
        <FaCloudArrowDown className='size-8' /> Retrieve from Cloud
    </button>
    </div>

      <div className='flex justify-center mt-4 text-3xl font-bold text-center group'>
        <span className='text-green-700 group-hover:text-black dark:group-hover:text-white'>&lt;</span>
            <span className='group-hover:text-green-700 dark:text-white'>Shoob</span>
          <span className='text-green-700 group-hover:text-black dark:group-hover:text-white'>Pass/&gt;</span>
      </div> 
      
      <p className='text-green-900 text-lg text-center font-semibold dark:text-white '>A Personalized Secure Password Manager App</p>
      <div className="flex flex-col items-center text-black p-4 gap-8">
        <input ref={urlRef} value={form.url} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full w-full border border-green-500 py-1 px-2' type="text" name='url' id='url' />
          <div className="flex w-full  justify-between gap-3">
            <input ref={userRef} value={form.user} onChange={handleChange} placeholder='Enter Username' className='rounded-full w-full border border-green-500 py-1 px-2' type="text" name='user' id='user' />
            
            <div className="relative"> 
              <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full w-full border border-green-500 py-1 px-2' type={isPasswordVisible ? `text` : `password`} name='password' id='pass' />
              <span onClick={showPassword} className='absolute right-1 top-1  text-black'>
              {isPasswordVisible ? (
                    <MdVisibilityOff id="show-off" className='size-6 cursor-pointer' />
                ) : (
                    <MdVisibility id="show-on" className='size-6 cursor-pointer' />
                )}
              </span>

            <Tooltip anchorSelect="#show-off" place="top">Don't Show Password</Tooltip>
            <Tooltip anchorSelect="#show-on" place="top">Show Password</Tooltip>
            </div>

          </div>
          <button onClick={savePassword} className='bg-green-500 hover:bg-green-600 active:bg-green-900 flex flex-row gap-0.5  text-white rounded-full p-3 w-fit border border-gray-8 00'><MdAddToPhotos className='size-7'/><span className='font-bold text-lg'>Add An Entry</span></button>
      </div>  

      <div className="passwords">
        <h2 className='font-bold text-4xl mb-4 dark:text-white'>Saved Passwords</h2>
        {passwords.length === 0 ? <p className='text-center text-2xl font-semibold text-red-500'>No Passwords Saved Yet</p> :
        <table className="table-auto w-full overflow-hidden rounded-md"> {/* rounded or any border property before adding to a table it needs to have overflow-hidden */}      <thead className='bg-green-800 text-white'>
            <tr>
              <th className='py-2'>Website URL</th>
              <th className='py-2'>Username</th>
              <th className='py-2'>Passwords</th>
              <th className='py-2'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-purple-100'>
            {currentPasswords.map((item, index)=>{
              return <tr key={index} className=''>
                  <td className='py-2 text-center w-1/2 border border-white'>
                    <div className='flex gap-1 justify-center items-center'>
                      {editingId === item.id ? (<span className='font-semibold text-xl'>Editing...</span>) : (
                        <><a href={`item.url`} target='_blank'> {item.url} </a>
                      <FaCopy id={`copy1-${index}`} className='cursor-pointer hover:scale-125 transition-all duration-100 active:scale-100' onClick={() => { navigator.clipboard.writeText(item.url); toast.success('URL Copied to Clipboard') }} />
                      <Tooltip anchorSelect={`#copy1-${index}`} place="top">Copy to Clipboard</Tooltip>
                      </>
                      )}

                    </div>
                  </td>
                  <td className='py-2 text-center w-32 border border-white'>
                    <div className='flex gap-1 justify-center items-center'>
                    {editingId === item.id ? (<span className='font-semibold text-xl'>Editing...</span>) : (
                        <>{item.user}
                      <FaCopy id={`copy2-${index}`} className='cursor-pointer hover:scale-125 transition-all duration-100 active:scale-100' onClick={() => { navigator.clipboard.writeText(item.user); toast.success('Username Copied to Clipboard') }} />
                      <Tooltip anchorSelect={`#copy2-${index}`} place="top">Copy to Clipboard</Tooltip>
                      </>
                      )}
                    </div>
                  </td>
                  <td className='py-2 text-center w-32 border border-white'>
                   <div className='flex gap-1 justify-center items-center'>
                  {editingId === item.id ? (
                    <span className='font-semibold text-xl'>Editing...</span>
                  ) : (
                    <>
                      {tablePasswordVisibility[item.id] ? item.password : '•'.repeat(item.password.length)}
                      <button id={`show-${index}`} onClick={() => toggleTablePasswordVisibility(item.id)}>
                        {tablePasswordVisibility[item.id] ? <MdVisibilityOff className='size-5 hover:scale-125' /> : <MdVisibility className='size-5 hover:scale-125' />}
                      </button>
                      <Tooltip anchorSelect={`#show-${index}`} place="top">{tablePasswordVisibility[item.id] ? 'Hide Password' : 'Show Password'}</Tooltip>
                      <FaCopy id={`copy3-${index}`} className='cursor-pointer hover:scale-125 transition-all duration-100 active:scale-100' onClick={() => { navigator.clipboard.writeText(item.password); toast.success('Password Copied to Clipboard') }} />
                      <Tooltip anchorSelect={`#copy3-${index}`} place="top">Copy to Clipboard</Tooltip>
                    </>
                  )}
                </div>
                  </td>
                  <td className='py-2 text-center w-32 border border-white'>
                    <div className='flex gap-1 justify-center items-center'>
                      {editingId === item.id ? (<><MdCancel id={`cancel-${index}`} className='cursor-pointer size-8  hover:scale-125  transition-all duration-100' onClick={cancelEdit}/>
                    <Tooltip anchorSelect={`#cancel-${index}`} place="top">Cancel Edit</Tooltip> </>
                    ) : (<>
                        <MdEdit id={`edit-${index}`} className='cursor-pointer size-6  hover:scale-125  transition-all duration-100' onClick={()=>{editEntry(item.id)}}/>
                      <Tooltip anchorSelect={`#edit-${index}`} place="top">Edit</Tooltip>
                      <MdDelete id={`delete-${index}`} className='cursor-pointer  size-6 hover:scale-125  transition-all duration-100'  onClick={() => {handleDeleteClick(item.id)}}/>
                      <Tooltip anchorSelect={`#delete-${index}`} place="top">Delete</Tooltip>
                      </>)}

                    </div>
                  </td>
                </tr>
            })}
          </tbody>
        </table>
    }
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center font-semibold dark:text-white">
          <label htmlFor="entriesPerPage" className="mr-2">Show</label>
          <select
            id="entriesPerPage"
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className="border rounded px-2 py-1 dark:bg-black"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
        <div className="flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 border rounded font-semibold ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-zinc-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this entry?</p>
            <div className="flex justify-end mt-4 font-bold">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 active:bg-red-800" onClick={deleteEntry}>Delete</button>
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  )
}

export default Manage