import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectmyRoute from "./utils/ProtectRoute";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from "./redux/reducers/auth";
import { addUser } from "./redux/slices/userSlice";
import { useSocket, SocketProvider } from "./utils/Socket";

const backendServer = import.meta.env.VITE_BASE_URL;

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const Notfound = lazy(() => import("./pages/Notfound"));

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.auth);
  const [loggedInUserdetails, setLoggedinuserdetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendServer}/api/v1/users/profile`, { withCredentials: true });
        if (res.data.success) {
          setLoggedinuserdetails(res.data.user);
          dispatch(addUser(res.data.user));
          
          dispatch(userExists(true));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  // Using useSocket hook for socket management
  const socket = useSocket();  // Get socket from context
  
  useEffect(() => {
    if (socket) {
      console.log('Socket is connected:  ', socket.connected);
      console.log('socket in app => ', socket);
  
      // Example: Listening for incoming messages
      socket.on('message', (data) => {
        console.log('Received message:', data);
      });
  
      // Cleanup
      return () => {
        // socket.off('message'); Clean up the event listener when the component unmounts
      };
    }
  }, [socket]);
  

  // Function to disable the default context menu
  const disableContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div onContextMenu={disableContextMenu}>
      {/* Wrap Routes inside Suspense for lazy loading */}
      <Suspense
        fallback={
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-black flex justify-center items-center duration-[2s]">
            <img src="./loader.gif" alt="loader" className="" />
          </div>
        }
      >
        <SocketProvider> {/* Wrap everything inside SocketProvider */}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectmyRoute user={user}>
                  <Home loggedInUserdetails={loggedInUserdetails} />
                </ProtectmyRoute>
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/chat"
              element={
                <ProtectmyRoute user={user}>
                  <Chat loggedInUserdetails={loggedInUserdetails} />
                </ProtectmyRoute>
              }
            />
            <Route
              path="/chat/:_id"
              element={
                <ProtectmyRoute user={user}>
                  <Chat />
                </ProtectmyRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectmyRoute user={user}>
                  <Groups />
                </ProtectmyRoute>
              }
            />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </SocketProvider>
      </Suspense>
    </div>
  );
}

export default App;
