import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />

      <div className="fixed w-full h-[calc(100vh-10vh)] flex text-black">
        {/* First Div */}
        <div className="w-full md:w-[50%] h-full bg-blue-200">
          home
        </div>

        {/* Second Div */}
        <div className="hidden md:flex md:w-[25%] h-full bg-green-700">
          second
        </div>

        {/* Third Div */}
        <div className="hidden md:flex md:w-[25%] h-full text-white bg-black">
          third
        </div>
      </div>
    </div>
  );
}

export default Home;
