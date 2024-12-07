import React, { useState } from 'react'
import {Link,NavLink} from 'react-router-dom'
import {toast} from 'react-hot-toast'
function Signup({setIsloggedin}) {
    const [showPassword, setShowpassword] = useState(false)
    const [userName,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [profilePic, setProfilepic] = useState('')
    const [bio, setBio] = useState('')

    const handleSignup
 = (event) =>{
    event.preventDefault()
    if(userName.trim().length < 3 || userName.trim().length > 25){
      return toast.error('Username must be greater than 3 charasters and less than 25 characters')
    }else if(password.trim().length < 8 || password.trim().length > 20){
      return toast.error('Password must be greater than 8 charasters and less than 20 characters')
    }else if(bio.trim().length < 5){
      toast.error('Bio should contain minimum 5 and maximum 50 characters')
    }
    console.log('userName is : ', userName)
    console.log('email is : ', email)
    console.log('password is : ', password)
    console.log('profilePic is : ', profilePic)
    console.log('bio is : ',bio)
}
  return (
    <div className='py-2 px-5 h-screen flex flex-col justify-between md:w-[35%] md:ml-auto md:mr-auto  md:mt-2 md:rounded-xl bg-white md:h-[98vh]'>
    <div>     
    <h1 className='text-center text-2xl mb-2 font-bold text-black'>Signup</h1>
    <div className='w-[20vw] h-[20vw] md:w-[6vw] md:h-[6vw] bg-violet-100 ml-auto mr-auto rounded-full mb-2'>

    <img src='https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png' alt='user_image' className='w-full h-full object-cover' />
    </div>
 
    <label for="profilePic" className='text-sm mt-1 md:block'>Choose a profile picture:</label>
    <input type='file' className='mt-2 mb-6 bg-violet-50 rounded-r-md '  value={profilePic}
            onChange={(event)=> setProfilepic(event.target.value)} ></input>

      <form >

        <label  className='md:text-lg'>Your Name</label>
        <div className='flex gap-4 mb-7'>
          <input
          id='userName'
            required
            value={userName}
            onChange={(event)=> setUsername(event.target.value)}
            className='bg-[#eeeeee] w-full rounded-lg px-4 py-2 border  text-lg  placeholder:text-base'
            type="text"
            placeholder='Your name'
            
          />
          
        </div>

        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
          required
          value={email}
          onChange={(event)=> setEmail(event.target.value)}          
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          type="email"
          placeholder='email@gmail.com'
        />

        <h3 className='text-lg font-medium '>Enter Password</h3>

        <input
          className='bg-[#eeeeee] mb-0 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          value={password}
          onChange={(event)=> setPassword(event.target.value)}
          required  type={showPassword ? 'text' : 'password'}
          autoComplete='true'
          placeholder='password'
        />
        <p className='text-end text-lg  font-bold cursor-pointer ' onClick={() => setShowpassword(!showPassword)}>{showPassword ? 'Hide password' : 'show password'}</p>

        <h6 className='text-xs font-medium mt-[-10px]'>Enter Bio</h6>
        <input
          className='bg-[#eeeeee] mb-0 rounded-lg px-4 py-1 border w-full text-lg placeholder:text-base'
          value={bio}
          onChange={(event)=> setBio(event.target.value)}
          required  type='text'
          autoComplete='true'
          placeholder='bio'
        />

        
          
        

        <button onClick={(event) => handleSignup(event)} 
          className='bg-[#111] text-white font-semibold mb-2 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base mt-3 md:mt-0 '
        >Create Account</button>

      </form>
      <h2 className='text-center'>Already have a account? <span onClick={()=>setIsloggedin(true)} className='text-blue-600 cursor-pointer'>Login here</span></h2>
    </div>
    <div>
      <p className='text-[10px]  mt-1 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
        Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
    </div>
  </div>
  )
}

export default Signup
