import React from "react";
import { fileFormat, displayFile } from "../utils/helperFunctions.jsx";


function ChatBubble({ message, senderId, userId ,senderName, attachments}) {
  return (
    <div
      className={`flex ${
        senderId == userId ? "justify-end" : "justify-start"
      } my-2 px-4`}
    >
  
    
      <div
        className={`max-w-[60%] p-3 rounded-lg shadow-md ${
          senderId === userId
            ? "bg-[#96fb96] text-black" // Sender's message styling
            : "bg-[#FFFFFF] text-black" // Receiver's message styling
        }`}
      >
        {senderId !== userId ? <p className="text-xs font-semibold">{senderName} ..</p> : '' } 
        <p className="text-sm font-medium">{message}</p>

        {
          
        attachments?.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const filetype = fileFormat(url);

          return (
            <div key={index} className="flex gap-2">
              {displayFile(url, filetype)}
            </div>
          );
        })}
        
    
      </div>
    </div>
  );
}

export default ChatBubble;
