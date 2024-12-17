import React from 'react'
import { NavLink } from 'react-router-dom'

function Grouplist() {
  return (
    <div className="w-full  overflow-x-hidden h-full bg-black overflow-y-auto no-scrollbar  flex flex-col gap-2 bg-fit py-1 ">
    <div className="w-full min-h-[120%]  flex flex-col">
    {/* {sampleData
      .map((item, index) => (
        <>
        <NavLink to={`?group=${item._id}`}
          key={item._id}
          className="w-full h-[4rem] rounded-md bg-[#0f1b20e7] hover:bg-[black] duration-[1s]  text-white  text-lg md:text-xl    flex items-center flex-shrink-0    border-2 border-[#80808027] cursor-pointer  "
        >
        <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]  rounded-full ml-2 mr-6">
          <img src={item.avatar} alt='profilepic' className="w-full h-full object-cover rounded-full "/>
        </div>
          {item.name}
          
        </NavLink>
        <div className="w-[90%] h-[1px]  ml-10 mt-1"></div>
        </>         
        
      ))} */}
      
    </div>
  </div>
  )
}

export default Grouplist
