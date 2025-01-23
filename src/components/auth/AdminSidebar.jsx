import React from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { RiPieChart2Fill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SlLogout } from "react-icons/sl";

function AdminSidebar({ onSelect, selectedPage }) {
  const navigate = useNavigate();
  const menuItems = [
    { id: "orderHistory", label: "Order History", icon: <IoFastFoodOutline /> },
    { id: "reports", label: "Reports", icon: <RiPieChart2Fill /> },
    {
      id: "restaurants",
      label: "Restaurants",
      icon: <SiHomeassistantcommunitystore />,
    },
    { id: "users", label: "Users", icon: <FaUsers /> },
  ];

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-red-500 text-white h-full p-4">
      <h1 className="text-xl font-bold mb-5">Admin Dashboard</h1>
      <hr className="border-b-0 mb-5" />
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex items-center space-x-4 cursor-pointer p-2 rounded ${
              selectedPage === item.id ? "bg-red-600" : "hover:bg-red-600"
            }`}
          >
            <div>{item.icon}</div>
            <span>{item.label}</span>
          </li>
        ))}
        <li
          onClick={handleSignOut}
          className={`flex items-center space-x-4 cursor-pointer p-2 rounded hover:bg-red-600`}
        >
          <div>
            <SlLogout />
          </div>
          <span>Sign Out</span>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
