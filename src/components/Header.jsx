import React from "react";

function Header() {
  return (
    <div>
      <div className="flex justify-around items-center h-[80px] px-6 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-500">OrderNest</h1>
        </div>
        <div className="flex space-x-6">
          <div className="hover:bg-slate-200 p-1 rounded transition duration-200">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Billing
            </a>
          </div>
          <div className="hover:bg-slate-200  p-1 rounded transition duration-200">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Inventory
            </a>
          </div>
          <div className="hover:bg-slate-200  p-1 rounded transition duration-200">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Reporting
            </a>
          </div>
          <div className="hover:bg-slate-200  p-1 rounded transition duration-200">
            <a href="#" className="text-gray-700 hover:text-blue-500">
              Menu
            </a>
          </div>
        </div>
        <div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Book Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
