import React from "react";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import { IoQrCodeOutline } from "react-icons/io5";

function Sidebar({ onSelect, selectedPage }) {
  const menuItems = [
    {
      name: "Menu",
      key: "addMenuItem",
      icon: <MdOutlineRestaurantMenu size={25} />,
    },
    { name: "Add Staff", key: "addStaff", icon: <FiUsers size={25} /> },
    {
      name: "Inventory",
      key: "inventory",
      icon: <MdOutlineInventory2 size={25} />,
    },
    {
      name: "Genrate Code",
      key: "qrcode",
      icon: <IoQrCodeOutline size={25} />,
    },
    {
      name: "Orders",
      key: "orderpage",
      icon: <MdOutlineInventory2 size={25} />,
    },
  ];

  return (
    <div className="bg-red-500 text-white w-64 h-screen flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b border-white">
        Manager Panel
      </h2>
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`p-4 cursor-pointer mb-1 py-3 m-2 ${
              selectedPage === item.key
                ? "bg-red-400 rounded"
                : "hover:bg-red-400 rounded"
            }`}
            onClick={() => onSelect(item.key)}
          >
            <div className="flex items-center gap-5">
              {item.icon}
              {item.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
