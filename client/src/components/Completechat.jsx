import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import ChatBubble from "../components/ChatBubble";
import { useSocket } from "../utils/Socket";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
const backendServer = import.meta.env.VITE_BASE_URL;
function Completechat() {
  const { _id } = useParams();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [showFileoptions, setShowFileoptions] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatId, setChatid] = useState("");
  const user = useSelector((store) => store.user);

  const fetChatDetails = async (_id) => {
    try {
      const res = await axios.get(
        `${backendServer}/api/v1/chats/${_id}?populate=true`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setMembers(res.data.chat?.members || []);
        setChatid(res.data.chat?._id || "");
      } else {
        console.error("Failed to fetch chat details:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  useEffect(() => {
    fetChatDetails(_id);
  }, [_id]);

  const memberIds = members?.map((member) => member._id);

  // Handle message submission
  const handleMessagesubmit = () => {
    if (message.trim().length < 1) toast.error("Message is empty");
    socket.emit("NEW_MESSAGE", { chatId, members: memberIds, message });

    setMessage(""); // Clear the input after submitting
  };

  const [messages, setMessages] = useState([]); // State for messages

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  // const eventHandler = {
  //   [ALERT]: alertListener,
  //   ['NEW_MESSAGE']: newMessagesListener,
  //    [START_TYPING]: startTypingListener,
  //   [STOP_TYPING]: stopTypingListener,
  // };

  useEffect(() => {
    socket.on("NEW_MESSAGE", newMessagesListener);
    // console.log('messages *** ',messages)
    return () => {
      socket.off("NEW_MESSAGE", newMessagesListener);
    };
  }, [socket, chatId]);

  //chatId ko dependency array me dal k fetch krna h message aur map krna h
  const fetchAllchats = async () => {
    try {
      const res = await axios.get(
        `${backendServer}/api/v1/chats/message/${chatId}`,
        { withCredentials: true }
      );
      // console.log('received id is ->> ',chatId)
      if (res.data.success) {
        setMessages(res.data.messages);
        // console.log(res)
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllchats();
  }, [chatId]);

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
            {messages?.map((msg, index) => (
              <ChatBubble
                key={msg._id || index} // fallback to index if _id is not unique
                message={msg.content}
                senderId={msg.sender._id}
                userId={user._id}
                senderName={msg.sender.name}
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
