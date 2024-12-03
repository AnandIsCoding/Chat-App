import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Notfound() {
  const navigate = useNavigate()
  return (
    <div className='fixed w-screen h-screen bg-black'>
      <img src='./404.gif' alt='404' className='w-full h-full object-cover' />
      <button onClick={() => navigate('/')} className='absolute top-2 right-2 text-white text-xl rounded-md px-3 py-1 border-2 border-zinc-200 md:text-2xl'>Go Home</button>
    </div>
  )
}

export default Notfound
