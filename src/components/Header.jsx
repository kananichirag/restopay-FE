import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/login");
  };

  return (
    <header>
      <div className="container mx-auto px-6 flex justify-around items-center h-[80px]">
        {/* Logo */}
        <div>
          <h1 className="text-4xl font-bold text-red-500">RestoPay</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10">
          <a
            href="#"
            className="hover:bg-red-100 text-gray-700 text-lg hover:text-red-700 px-4 py-2 rounded transition duration-200"
          >
            Billing
          </a>
          <a
            href="#"
            className="hover:bg-red-100 text-gray-700 text-lg hover:text-red-700 px-4 py-2 rounded transition duration-200"
          >
            Inventory
          </a>
          <a
            href="#"
            className="hover:bg-red-100 text-gray-700 text-lg hover:text-red-700 px-4 py-2 rounded transition duration-200"
          >
            Reporting
          </a>
          <a
            href="#"
            className="hover:bg-red-100 text-gray-700 text-lg hover:text-red-700 px-4 py-2 rounded transition duration-200"
          >
            Menu
          </a>
        </nav>

        {/* Book Demo Button */}
        <div className="hidden md:block">
          <button
            onClick={handleOnClick}
            className="border border-red-500 text-gray-700 px-4 py-1 md:px-6 md:py-2 md:text-sm lg:text-base rounded-md hover:bg-red-500 hover:text-white transition duration-200"
          >
            Login
          </button>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block md:hidden text-gray-700 hover:text-red-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-2 px-6 py-4">
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded transition duration-200"
              >
                Billing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded transition duration-200"
              >
                Inventory
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded transition duration-200"
              >
                Reporting
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded transition duration-200"
              >
                Menu
              </a>
            </li>
            <li>
              <button className="w-full bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200">
                Book Demo
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
