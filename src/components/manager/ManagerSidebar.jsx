import React from "react";

function Sidebar({ onSelect, selectedPage }) {
  const menuItems = [
    { name: "Menu", key: "addMenuItem" },
    { name: "Add Staff", key: "addStaff" },
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
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
