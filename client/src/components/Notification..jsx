import React, { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
const backendServer = import.meta.env.VITE_BASE_URL;
function Notification({ setShownotification }) {
  const [friendrequests, setFriendrequests] = useState([])
  const fetchNotifications = async()=>{
    try {
      const res = await axios.get(`${backendServer}/api/v1/users/notifications`, {withCredentials:true})
    if(res.data.success){
      setFriendrequests(res.data.allRequests) 
      toast.success(res.data.message)
    }else{
      console.log(res.data.message)
      toast.error(res.data.message)
    }
    } catch (error) {
      console.log('error in  fetching users in searchComponent ', error)
    }
  }
  useEffect(()=>{
    fetchNotifications()
    console.log('friend requests =>> ',friendrequests)
  },[])

  const handleAcceptfriend = async (_id, accept) => {
    try {
      const res = await axios.post(`${backendServer}/api/v1/users/acceptrequest`, {requestId:_id, accept}, {withCredentials: true});
      console.log('res of accept/reject =>> ', res);
  
      if (res.data.success) {
        toast.success(res.data.message);
      }
  
      // Use functional setState to ensure you are updating with the latest state
      setFriendrequests((prevRequests) => 
        prevRequests.filter((request) => request._id !== _id)
      );
    } catch (error) {
      console.log('Error:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
    
  };
  

  
  

  return (
    <div className="absolute border-2 shadow-2xl shadow-[black] border-black top-[20%] z-[999] right-0 left-0 w-[97%] md:w-[64vw] lg:w-[38%] py-4 bg-white rounded-xl mx-auto flex flex-col px-4 duration-[2s]">
      {/* Close button */}
      <div
        onClick={() => setShownotification((prev) => !prev)}
        className="cursor-pointer absolute right-2 top-2 w-[14vw] md:w-[4vw] h-4 rounded-full bg-black"
      ></div>

      {/* Header */}
      <h1 className="text-lg md:text-xl font-bold text-center">Notifications</h1>
      {friendrequests?.length<1 && <h1 className="text-xl text-black font-semibold">You have not any Friend requests yet</h1>}
      {/* Notification items */}
      {friendrequests?.map((item, index) => {
        return (
          <div
            key={item._id}
            className="onenotification mt-3 w-full bg-white text-black rounded-xl active:bg-white duration-[0.5s] flex items-center px-4 py-2 gap-3 border-2 border-black justify-between hover:bg-blue-200"
          >
            {/* Sender details */}
            <div className="flex gap-3 items-center">
              <div className="w-[15vw] h-[15vw] md:w-[10vw] md:h-[10vw] lg:w-[3vw] lg:h-[3vw] rounded-full overflow-hidden">
                <img
                  src={item.sender.avatar}
                  alt="profilepic"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h1 className="text-sm md:text-lg lg:text-xl font-bold">
                {item.sender.name}
              </h1>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button onClick={()=> handleAcceptfriend(item._id, true)} className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-[#126c12] text-white font-bold text-md md:text-sm lg:text-base">
                Accept
              </button>
              <button onClick={()=> handleAcceptfriend(item._id, false)} className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-[red] text-white font-bold text-md md:text-sm lg:text-base">
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Notification;
