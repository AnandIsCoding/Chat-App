import React from 'react'
import Navbar from "../components/Navbar";
import Chatlist from "../components/Chatlist";
import Profile from "../components/Profile";
import Completechat from '../components/Completechat';
function Chat() {
  return (
    <div className="min-h-screen min-w-screen">
    <Navbar />

    <div className="fixed w-full h-[calc(100vh-10vh)] flex text-black 
">
      {/* First Div */}
      <div className=" hidden md:flex w-full md:w-[35%] h-full overflow-hidden bg-black">
        <Chatlist/>
      </div>

      {/* Second Div */}
      <div className=" md:flex w-[100%] md:w-[40%] h-full bg-black bg-[url('https://camo.githubusercontent.com/ebf18cd85f7aa9dc79fb74c58dc94febf3a6441d8d689cd5a400b2707e19ec0e/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')] bg-cover ">
        <Completechat/>
      </div>

      {/* Third Div */}
      <div className="hidden md:flex md:w-[25%] h-full text-white bg-black">
        <Profile/>
      </div>
    </div>
  </div>
  )
}

export default Chat
