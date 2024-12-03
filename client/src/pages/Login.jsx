import React, { useState } from 'react'
import Signup from '../components/signup'
import LoginComponent from '../components/LoginComponent'

function Login() {
  const [isLoggedin, setIsloggedin] = useState(false)
  return (
    <div className='bg-[url("./image.jpg")] bg-cover fixed w-screen h-screen '>
      {
        isLoggedin ? <LoginComponent setIsloggedin={setIsloggedin}/> : <Signup setIsloggedin={setIsloggedin}/>
      }
    </div>
  )
}

export default Login
