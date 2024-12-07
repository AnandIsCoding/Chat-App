import React, { useState } from 'react';
import { useNavigate,  useSearchParams } from 'react-router-dom'; // Import useNavigate for navigation
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Grouplist from './Grouplist';

function Completegroup() {
  const [openPanel, setOpenPanel] = useState(false); // Fix typo
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchParams, setSearchParams] = useSearchParams();
  const groupId = searchParams.get('group') 
  const [showChangename, setShowchangename] = useState(false)

  const [groupName, setGroupname] = useState('Web Devlopment')
  const [newGroupvalue, setnewgroupvalue] = useState('')

  const handlegroupnamechangesubmit = () =>{
    if(newGroupvalue.trim().length > 0){ setGroupname(newGroupvalue)}
    
    setnewgroupvalue('')
    setShowchangename(false)
  }


  return (
    <div className="w-full min-h-screen pt-4 bg-[#000000da] bg-[url('./image.jpg')] bg-cover relative ">
    <div className='w-full h-full bg-[#000000df] absolute top-0 bottom-9 left-0 right-0'></div>
        <div className='w-full relative'>

        
           {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)} // Use navigate(-1) for backward navigation
        className="px-3 py-1 rounded-md border-2 border-white text-white text-lg font-semibold bg-zinc-90 ml-4 hover:bg-green-700 "
      >
        &lt; &nbsp; Go back
      </button>

      {/* Hamburger Menu */}
      <h1
        onClick={() => setOpenPanel(!openPanel)}
        className="md:hidden text-3xl font-semibold cursor-pointer ml-20 text-white absolute right-4 top-4"
      >
        {!openPanel ? <GiHamburgerMenu /> : <IoCloseSharp/>}
      </h1>

      {/* sidebar panel */}
      <div className={`absolute min-h-screen ${openPanel ? 'w-[62%]' : 'w-[0%] '}  z-[999] top-0 duration-[0.5s] ease-in-out `} >
        <Grouplist  />
      </div>


      {/* main section */}
       <div className='w-full min-h-screen  '>
        <div className='flex gap-2 justify-center'>
        <h1 className='text-center text-2xl font-bold text-white mt-2 md:mt-0'> {`${groupId ? `selected group ${groupId} ` : 'No group selected'}`} </h1>
        

        {showChangename && <div className='absolute top-[13%] bg-white border-2 border-black rounded-xl px-5 py-4 pt-10 flex gap-2'>
          <h1
        onClick={() => setShowchangename(false)}
        className=" text-3xl font-semibold cursor-pointer ml-20 text-black absolute right-4 top-0"
      >
        <IoCloseSharp/>
      </h1>
           <input onChange={(event) => setnewgroupvalue(event.target.value)} type='text' value={newGroupvalue} id='newGroupvalue' name='newGroupvalue' className='px-3 py-1 rounded-xl border-2 border-black ' />
           <button onClick={handlegroupnamechangesubmit} className='px-2 py-2 text-xl rounded-md  text-white bg-blue-600 font-bold flex'>Confirm</button>
        </div>
        }

        


        </div>
       </div>
       
      
        </div>
    </div>
  );
}

export default Completegroup;
