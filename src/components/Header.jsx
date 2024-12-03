import React from "react";

function Header() {
  return (
    <div>
      <div className="flex justify-around items-center h-[80px] px-6 ">
        <div>
          <h1 className="text-5xl font-bold text-red-500">RestoPay</h1>
        </div>
        <div className="flex space-x-10">
          <div className="hover:bg-red-100 text-gray-700 hover:text-red-700 p-2  rounded transition duration-200 cursor-pointer">
            <a href="#" className="">
              Billing
            </a>
          </div>
          <div className="hover:bg-red-100 text-gray-700 hover:text-red-700 p-2 rounded transition duration-200 cursor-pointer">
            <a href="#">Inventory</a>
          </div>
          <div className="hover:bg-red-100 text-gray-700 hover:text-red-700 p-2 rounded transition duration-200 cursor-pointer">
            <a href="#">Reporting</a>
          </div>
          <div className="hover:bg-red-100 text-gray-700 hover:text-red-700 p-2 rounded transition duration-200 cursor-pointer">
            <a href="#">Menu</a>
          </div>
        </div>
        <div>
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200">
            Book Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
