import React, { useState } from 'react';
import { addgroupSampledata } from '../utils/data';
import { FaArrowUp } from 'react-icons/fa';

function Creategroup({ setShowcreategroup }) {
  const [selectedUsers, setSelectedusers] = useState([]);
  const [groupName, setGroupname] = useState('');

  const toggleUser = (id) => {
    setSelectedusers((prev) => {
      if (prev.includes(id)) {
        // Remove user if already selected
        return prev.filter((_id) => _id !== id);
      } else {
        // Add user if not already selected
        return [...prev, id];
      }
    });
   
  };
  console.log(selectedUsers)

  return (
    <div className="absolute border-2 shadow-2xl shadow-[black] border-black top-[10%] z-[999] right-0 left-0 w-[64vw] py-2 bg-white rounded-xl duration-[1s] search md:w-[38%] mx-auto flex flex-col px-4">
      <div
        onClick={() => setShowcreategroup((prev) => !prev)}
        className="cursor-pointer absolute right-1 top-2 w-[10vw] md:w-[3vw] h-[10px] md:h-[10px] rounded-full bg-black"
      ></div>
      <h1 className="text-xl font-bold text-center">Create new Group</h1>
      <input
        onChange={(event) => setGroupname(event.target.value)}
        type="text"
        name="groupname"
        placeholder="Group Name"
        className="w-full bg-transparent border-2 border-black rounded-lg py-2 px-4"
      />
      <h2 className="text-lg font-semibold mt-1 ml-2">Members</h2>

      {addgroupSampledata.map((item) => (
        <div
          key={item._id}
          className="onenotification mt-2 w-full h-[4rem] bg-white text-black text-lg rounded-xl active:bg-white duration-[0.5s] flex items-center flex-shrink-0 px-4 md:ml-2 cursor-pointer hover:bg-blue-200 gap-3 border-2 border-black justify-between"
        >
          <div className="flex gap-2">
            <div className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw] rounded-full">
              <img
                src={item.avatar}
                alt="profilepic"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-xl font-bold mt-2">{item.name}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleUser(item._id)}
              className={`px-4 py-2 rounded-lg text-white font-bold ${
                selectedUsers.includes(item._id) ? 'bg-[red]' : 'bg-[#126c12]'
              }`}
            >
              {selectedUsers.includes(item._id) ? 'Remove' : 'Add'}
            </button>
          </div>
          
        </div>
        
      ))}
      <div className='flex gap-2 justify-center mt-2'> <button className='px-4 py-2 rounded-lg text-white font-semibold md:font-extrabold bg-[red]'>cancel</button> <button className='px-4 py-2 rounded-lg text-white font-semibold md:font-extrabold bg-[#4227ef]' onClick={console.log(groupName)}>Create </button> </div>
    </div>
  );
}

export default Creategroup;
