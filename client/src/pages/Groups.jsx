import React from 'react'
import Grouplist from '../components/Grouplist'
import Completegroup from '../components/Completegroup'

function Groups() {
  return (
    <div className=" md:flex w-[100%] h-full bg-black  bg-fit fixed">
      <div className='
      w-[30%]  min-h-screen hidden  md:flex flex-col '>
        <Grouplist/>
      </div>

<div className='
     w-[100%] md:w-[70%]  min-h-screen '> <Completegroup/> </div>
    </div>
  )
}

export default Groups
