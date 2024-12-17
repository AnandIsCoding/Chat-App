import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import { addUser } from '../redux/slices/userSlice.js';
import { userExists, userNotExists } from "../redux/reducers/auth.js";
function Signup({ setIsloggedin }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const backendServer = import.meta.env.VITE_BASE_URL;
  const [showPassword, setShowpassword] = useState(false);
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilepic] = useState(null);
  const [bio, setBio] = useState('');

  const handleSignup = async (event) => {
    setLoading(true)
    event.preventDefault();
  
    // Validate inputs
    if (userName.trim().length < 3 || userName.trim().length > 25) {
      setLoading(false)
      return toast.error('Username must be between 3 and 25 characters.');      
    }
    if (password.trim().length < 8 || password.trim().length > 20) {
      setLoading(false)
      return toast.error('Password must be between 8 and 20 characters.');
    }
    if (bio.trim().length < 5 || bio.trim().length > 50) {
      setLoading(false)
      return toast.error('Bio should contain between 5 and 50 characters.');
    }
    if (!email.includes('@') || !email.includes('.')) {
      setLoading(false)
      return toast.error('Please enter a valid email address.');
    }
    if (!profilePic) {
      setLoading(false)
      return toast.error('Please upload a valid profile picture.');
    }
  
    try {
      // Create FormData object
      // Before making the request
const formData = new FormData();
formData.append("name", userName);
formData.append("email", email);
formData.append("password", password);
formData.append("bio", bio);
formData.append("avatar", profilePic); // Appending the selected file


  
      const response = await axios.post(`${backendServer}/api/v1/users/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        toast.success(response.data.message || 'Signup successful!');
        console.log('Token:', response.data.token);
        dispatch(addUser(response.data.user))
        // Store token and set user state
        localStorage.setItem('token', response.data.token);

        dispatch(userExists(true)); // Assuming userExists updates login state
        setLoading(false)
        // Redirect after successful signup
        navigate('/');
      } else {
        toast.error(response.data.message || 'Signup failed!');
        console.log('Response:', response);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error in signup component:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
      setLoading(false)
    }
  };
  

  return (
    <div className="py-2 px-5 h-screen flex flex-col justify-between md:w-[35%] md:ml-auto md:mr-auto md:mt-2 md:rounded-xl bg-white md:h-[98vh]">
      <div>
        <h1 className="text-center text-2xl mb-2 font-bold text-black">Signup</h1>
        <div className="w-[20vw] h-[20vw] md:w-[6vw] md:h-[6vw] bg-violet-100 ml-auto mr-auto rounded-full mb-2">
          <img
            src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
            alt="user_image"
            className="w-full h-full object-cover"
          />
        </div>

        <label htmlFor="profilePic" className="text-sm mt-1 md:block">
          Choose a profile picture:
        </label>
        <input
          type="file"
          className="mt-2 mb-6 bg-violet-50 rounded-r-md"
          onChange={(event) => setProfilepic(event.target.files[0])} // Get file from event
          name='avatar'
        />

        <form>
          <label className="md:text-lg">Your Name</label>
          <div className="flex gap-4 mb-7">
            <input
              id="userName"
              required
              value={userName}
              onChange={(event) => setUsername(event.target.value)}
              className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border  text-lg  placeholder:text-base"
              type="text"
              placeholder="Your name"
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@gmail.com"
          />

          <h3 className="text-lg font-medium">Enter Password</h3>

          <input
            className="bg-[#eeeeee] mb-0 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete="true"
            placeholder="password"
          />
          <p
            className="text-end text-lg font-bold cursor-pointer"
            onClick={() => setShowpassword(!showPassword)}
          >
            {showPassword ? 'Hide password' : 'show password'}
          </p>

          <h6 className="text-xs font-medium mt-[-10px]">Enter Bio</h6>
          <input
            className="bg-[#eeeeee] mb-0 rounded-lg px-4 py-1 border w-full text-lg placeholder:text-base"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            required
            type="text"
            autoComplete="true"
            placeholder="bio"
          />
          {
            loading && <h1 className='text-black font-bold text-lg m-5 duration-[1s]'>Wait ▄︻デ══━一💥</h1>
          }

          <button
            onClick={(event) => handleSignup(event)}
            className="bg-[#111] text-white font-semibold mb-2 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base mt-3 md:mt-0"
          >
            Create Account
          </button>
        </form>
        <h2 className="text-center">
          Already have a account?{' '}
          <span
            onClick={() => setIsloggedin(true)}
            className="text-blue-600 cursor-pointer"
          >
            Login here
          </span>
        </h2>
      </div>
      <div>
        <p className="text-[10px] mt-1 leading-tight">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline">Google Privacy Policy</span> and{' '}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
