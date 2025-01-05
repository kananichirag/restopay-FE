import React, { useState } from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { RiPieChart2Fill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import Navbar from "../Navbar";
import Restaurants from "./Restaurants";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-red-500 text-white transition-transform transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative w-64 lg:block`}
      >
        <div className="flex justify-between p-4 text-lg font-bold border-b border-white">
          <h1> Dashboard</h1>
          <button
            className="lg:hidden"
            onClick={(e) => setIsSidebarOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="p-4 space-y-4 gap-2">
          <div className="flex items-center">
            <IoFastFoodOutline className="" size={30} />
            <button className="w-full py-2 text-lg">Order History</button>
          </div>
          <div className="flex items-center">
            <RiPieChart2Fill size={30} />
            <button className="w-full py-2">Reports</button>
          </div>
          <div className="flex items-center">
            <SiHomeassistantcommunitystore size={30} />
            <button className="w-full py-2">Restarurants</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-screen">
        <Navbar />
        {/* Toggle button for small screens */}
        <div className="p-4 bg-gray-100 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        <div className="">
          <Restaurants />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
