import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import ChatBubble from "../components/ChatBubble";
import { sampleMessagedata } from "../utils/data";


function Completechat() {
  const { _id } = useParams();
  const [message, setMessage] = useState("");
  const [showFileoptions, setShowFileoptions] = useState(false);

  // Handle message submission
  const handleMessagesubmit = () => {
    console.log("message is: ", message);
    setMessage(""); // Clear the input after submitting
  };

  return (
    <div className="py-2 h-full w-full bg-[#000000b4] border-r-4 border-l-4 border-[#2a3c44d6]">
      {/* Check if there is no _id to show the welcome message */}
      {!_id && (
        <h1 className="text-4xl font-bold text-white ml-[10%] mt-[5%]">
          Start chatting by selecting any friend ✌️
        </h1>
      )}

      <div className="h-full w-full relative">
        {_id && (
          <div className="h-[90%] w-full text-lg font-bold text-white overflow-y-auto">
            {sampleMessagedata.map((msg) => (
              <ChatBubble
                key={msg._id}
                message={msg.content}
                senderId={msg.sender._id}
                user={msg}
                userId = {msg._id}
                senderName = {msg.sender.name}
                attachments={msg.attachments}
              />
            ))}
          </div>
        )}

       

        {/* Message input section */}
        <div className="absolute bottom-0 bg-[#202C33] h-[10%] w-full flex justify-center items-center">
          {/* Add file options toggle button */}
          <IoAddSharp
            onClick={() => setShowFileoptions((prev) => !prev)}
            size={25}
            className="text-white font-extrabold ml-2 cursor-pointer"
          />

          {/* Message input box */}
          <div className="w-[99%] h-full bg-[#111B21] flex items-center p-2 rounded-lg shadow-lg">
            <input
              type="text"
              onChange={(event) => setMessage(event.target.value)}
              value={message}
              placeholder="Type a message..."
              className="w-[90%] h-full text-white px-4 py-2 bg-[#2A3942] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleMessagesubmit}
              className="h-full px-4 py-2 bg-[#202C33] text-white rounded-lg ml-2 flex items-center justify-center"
            >
              <IoMdSend size={25} />
            </button>
          </div>
        </div>

        {/* File options menu */}
        {showFileoptions && (
          <div
            className={`absolute bottom-[11%] z-[999] left-2 w-[64vw] md:w-[15vw]   bg-[#041215]  rounded-xl shadow-2xl shadow-[black] duration-[3s] mx-auto flex flex-col  min-h-[15vw] pt-4  `}
          >
            <div
              onClick={() => setShowFileoptions((prev) => !prev)}
              className="cursor-pointer absolute right-4 top-2 w-[10vw] md:w-[2.5vw] h-[10px] md:h-[10px] rounded-full bg-zinc-200"
            ></div>
            <div className="flex flex-col px-4 py-2 text-white gap-2">
              <button className="py-2 px-4 text-lg bg-gray-800 hover:bg-slate-600 duration-[1s] rounded-lg">
                Documents
              </button>
              <button className="py-2 px-4 text-lg bg-gray-800 hover:bg-slate-600 duration-[1s] rounded-lg">
                Photos
              </button>
              <button className="py-2 px-4 text-lg bg-gray-800 hover:bg-slate-600 duration-[1s] rounded-lg">
                Videos
              </button>
              <button className="py-2 px-4 text-lg bg-gray-800 hover:bg-slate-600 duration-[1s] rounded-lg">
                Location
              </button>
              <button className="py-2 px-4 text-lg bg-gray-800 hover:bg-slate-600 duration-[1s] rounded-lg">
                Voice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completechat;
