import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
const backendServer = import.meta.env.VITE_BASE_URL;
function Chatlist() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const fetchChats = async () => {
    try {
      const res = await axios.get(`${backendServer}/api/v1/chats/mychats`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setChats(res.data.chats);
        toast.success(res.data.message);
      } else {
        console.log(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("error in  fetching chats ", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="w-full  overflow-x-hidden h-full bg-black overflow-y-auto no-scrollbar  flex flex-col gap-2 bg-fit px-1 py-1 ">
      <div className="w-full min-h-[120%]  flex flex-col">
        {chats.length < 1 && (
          <h1 className="text-xl text-white font-bold">
            No chats found yet!
            <br />
            1. Send a request in the{" "}
            <span className="text-blue-400">Search🔍</span> section.
            <br />
            2. Or accept pending requests in the{" "}
            <span className="text-blue-400">Notifications🔔</span> section.
          </h1>
        )}
        {chats &&
          chats.map((item, index) => (
            <div key={item._id}>
              <div
                key={item._id}
                className="w-full h-[4rem] rounded-md bg-[#0f1b20e7] hover:bg-[black] duration-[1s]  text-white  text-lg md:text-xl    flex items-center flex-shrink-0    cursor-pointer  "
                onClick={() => navigate(`/chat/${item._id}`)}
              >
                <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]  rounded-full ml-2 mr-6">
                  <img
                    src={item.avatar}
                    alt="profilepic"
                    className="w-full h-full object-cover rounded-full "
                  />
                </div>
                {item.name}
              </div>
              <div className="w-[90%] h-[2px] bg-zinc-500 ml-20 mt-1"></div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Chatlist;
