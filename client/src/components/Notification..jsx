import React from "react";
import { notificationSampledata } from "../utils/data.js";

function Notification({ setShownotification }) {
  return (
    <div className="absolute border-2 shadow-2xl shadow-[black] border-black top-[20%] z-[999] right-0 left-0 w-[90vw] md:w-[64vw] lg:w-[38%] py-4 bg-white rounded-xl mx-auto flex flex-col px-4 duration-[2s]">
      {/* Close button */}
      <div
        onClick={() => setShownotification((prev) => !prev)}
        className="cursor-pointer absolute right-2 top-2 w-[14vw] md:w-[4vw] h-4 rounded-full bg-black"
      ></div>

      {/* Header */}
      <h1 className="text-lg md:text-xl font-bold text-center">Notifications</h1>

      {/* Notification items */}
      {notificationSampledata.map((item, index) => {
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
              <button className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-[#126c12] text-white font-bold text-xs md:text-sm lg:text-base">
                Accept
              </button>
              <button className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-[red] text-white font-bold text-xs md:text-sm lg:text-base">
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
