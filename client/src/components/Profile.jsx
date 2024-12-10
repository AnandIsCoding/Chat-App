import React from 'react';
import { userExists, userNotExists } from "../redux/reducers/auth";
import { useEffect, useState } from 'react';
import axios from "axios";
import {useDispatch, useSelector} from 'react-redux'
function Profile() {
  const backendServer = import.meta.env.VITE_BASE_URL;
const dispatch = useDispatch()
const [loggedInUserdetails, setLoggedinuserdetails] = useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendServer}/api/v1/users/profile`, { withCredentials: true, timeout: 5000 });
        if (res.data.success) {
          setLoggedinuserdetails(res.data.user);
          console.log(res.data.user);
          dispatch(userExists(true));
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchUser();
  }, [dispatch]);
  if (!loggedInUserdetails) return null; // Early return if no user details available

  const { name, bio, email, avatar } = loggedInUserdetails;
  const { url } = avatar;

  console.log('user name is => ', name);
  console.log('user bio is => ', bio);
  console.log('user email is => ', email);
  console.log('user url is => ', url);

  return (
    <div className="w-full h-full bg-[url('https://camo.githubusercontent.com/ebf18cd85f7aa9dc79fb74c58dc94febf3a6441d8d689cd5a400b2707e19ec0e/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')] bg-fit">
      {/* <div className='absolute top-0 bottom-0 h-full w-full bg-[#0e0e0eb3] opacity-[5]'></div> */}
      <div className="bg-[#111B21] h-full py-4">
        {/* Profile Image */}
        <div className="w-[15vw] h-[15vw] bg-white rounded-full mx-auto">
          <img
            src={url} // Dynamic URL from avatar
            alt="user_profilePic"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {/* Bio */}
        <h2 className="text-center mt-14 text-xl text-white font-extrabold">
          {bio ? bio : 'bio'}
        </h2>
        <p className="text-center text-white font-extrabold text-sm">Bio</p>

        {/* Username */}
        <h2 className="text-center mt-6 text-xl text-white font-extrabold">
          🤹‍♂️{name}
        </h2>
        <p className="text-center text-white font-extrabold text-sm">Username</p>

        {/* Email */}
        <h2 className="text-center mt-6 text-xl text-white font-extrabold">
          📧 {email}
        </h2>
        <p className="text-center text-white font-extrabold text-sm">Email</p>

        {/* Joined Date */}
        <h2 className="text-center mt-6 text-xl text-white font-extrabold">
          📆 01/12/2024
        </h2>
        <p className="text-center text-sm text-white font-extrabold">Joined</p>
      </div>
    </div>
  );
}

export default Profile;
