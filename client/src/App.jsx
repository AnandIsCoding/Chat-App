import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectmyRoute from "./utils/ProtectRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const Notfound = lazy(() => import("./pages/Notfound"));

function App() {
  const user = false;

  // Function to disable the default context menu
  const disableContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <div onContextMenu={disableContextMenu}>
      {/* Wrap Routes inside Suspense for lazy loading */}
      <Suspense fallback={<div className="absolute top-0 left-0 bottom-0 right-0 bg-black flex justify-center items-center duration-[2s]"> <img src='./loader.gif' alt='loader' className="" />  </div>}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectmyRoute user={user}>
                <Home />
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
                <Chat />
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
      </Suspense>
    </div>
  );
}

export default App;
