import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chatlist() {
  const backendServer = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [allchats, setAllChats] = useState(null);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await axios.get(`${backendServer}/api/v1/chats/mychats`, { withCredentials: true });
        if (res.data.success) {
          setAllChats(res.data.chats);  // Assuming the chats are in 'res.data.user'
          console.log('all chats =>>> ', res.data.chats);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChatList();
  }, []);

  // If allchats is null or still loading, you can show a loading spinner or placeholder.
  if (!allchats) return <div className='text-white font-semibold text-lg p-4'>Loading chats...</div>;

  return (
    <div className="w-full overflow-x-hidden h-full bg-black overflow-y-auto no-scrollbar flex flex-col gap-2 bg-fit px-1 py-1">
      <div className="w-full min-h-[120%] flex flex-col">
        {allchats.map((item) => (
          <React.Fragment key={item._id}>
            <div
              className="w-full h-[4rem] rounded-md bg-[#0f1b20e7] hover:bg-[black] duration-[1s] text-white text-lg md:text-xl flex items-center flex-shrink-0 cursor-pointer"
              onClick={() => navigate(`/chat/${item._id}`)}
            >
              <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full ml-2 mr-6">
                <img
                  src={item.groupChat ? item.avatar[2] : item.avatar}
                  alt="profilepic"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {item.name}
            </div>
            <div className="w-[90%] h-[2px] bg-zinc-500 ml-20 mt-1"></div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Chatlist;
