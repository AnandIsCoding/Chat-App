import React from "react";
import {sampleData} from '../utils/data.js'
import {useNavigate} from 'react-router-dom'
function Chatlist() {
  const navigate = useNavigate()
  return (
    <div className="w-full  overflow-x-hidden h-full bg-[#2a3c44d6] overflow-y-auto no-scrollbar  flex flex-col gap-2 bg-[url('https://camo.githubusercontent.com/ebf18cd85f7aa9dc79fb74c58dc94febf3a6441d8d689cd5a400b2707e19ec0e/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')] bg-fit ">
      <div className="w-full min-h-[200%] bg-[#2a3c44d6] flex flex-col">
      {sampleData
        .map((item, index) => (
          <>
          <div
            key={item._id}
            className="w-full h-[4rem] bg-[#0f1b20e7] hover:bg-[black] duration-[1s]  text-white  text-lg md:text-xl    flex items-center flex-shrink-0    cursor-pointer  "
            onClick={()=>navigate(`/chat/${item._id}`)}
          >
          <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]  rounded-full ml-2 mr-6">
            <img src={item.avatar} alt='profilepic' className="w-full h-full object-cover rounded-full "/>
          </div>
            {item.name}
            
          </div>
          <div className="w-[90%] h-[1px] bg-white ml-20"></div>
          </>         
          
        ))}
        
      </div>
    </div>
  );
}

export default Chatlist;
