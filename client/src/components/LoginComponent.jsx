import React, { useState } from 'react'
import axios from 'axios'
const backendServer = import.meta.env.VITE_BASE_URL;
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { userExists, userNotExists } from "../redux/reducers/auth.js";
import { addUser } from '../redux/slices/userSlice.js';
function LoginComponent({setIsloggedin}) {
  const navigate = useNavigate()
  const [showPassword, setShowpassword] = useState(false)
  const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const dispatch =useDispatch()

    const handleLogin = async (event) => {
      event.preventDefault();
     
      try {
        const response = await axios.post(`${backendServer}/api/v1/users/login`, {
          email,
          password,
        },{withCredentials:true,
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (response.data.success) {
          toast.success(response.data.message || "Login successful!");
          localStorage.setItem('token', response.data.token) // Store the token in local storage
          dispatch(addUser(response.data.user))          
          console.log(response)
          dispatch(userExists(true))
          navigate('/'); // Redirect to the home page or dashboard
        } else {
          toast.error(response.data.message || "Login failed!");
          console.log('Response:', response);
        }
      } catch (error) {
        dispatch(userExists(false))
        console.error('Error in login component =>', error);
        const errorMessage = error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
      }
    };
    
  return (
    <div className='py-2 px-5 h-screen flex flex-col justify-between md:w-[35%] md:ml-auto md:mr-auto  md:m-5 md:rounded-xl bg-white md:h-[80vh] md:mt-20'>
    <div>     
    <h1 className='text-center text-3xl  font-bold text-black mb-20 md:mb-10'>Login</h1>
      
  

      <form >

        

        <h3 className='text-lg font-bold mb-2'>Your registered email</h3>
        <input
          required 
          value={email}
          onChange={(event)=> setEmail(event.target.value)}          
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          type="email"
          placeholder='email@example.com'
        />

        <h3 className='text-lg  font-bold mb-2'>Enter Password</h3>
       

        <input
          className='bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          required type={showPassword ? 'text' : 'password'}
          autoComplete='true'
          placeholder='password'
          value={password}
          onChange={(event)=> setPassword(event.target.value)}
        />
         <p className='text-end text-lg mb-6 font-bold cursor-pointer ' onClick={() => setShowpassword(!showPassword)}>{showPassword ? 'Hide password' : 'show password'}</p>

        
          
        

        <button onClick={(event) => handleLogin(event)}
          className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-xl placeholder:text-base'
        >Login and get started</button>

      </form>
      <h2 className='text-center'>Don't have an account? <span onClick={()=>setIsloggedin(false)} className='text-blue-600 cursor-pointer'>Signup here</span></h2>
    </div>
    <div>
      <p className='text-[10px] md:text-[13px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
        Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
    </div>
  </div>
  )
}

export default LoginComponent
