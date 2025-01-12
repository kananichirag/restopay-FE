import React from "react";
import { FiX } from "react-icons/fi";

function FavouriteSidebar({ isOpen, toggleSidebar }) {
  const favouriteItems = [
    {
      id: 1,
      name: "Burger",
      price: 150,
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Fries",
      price: 80,
      imageUrl: "https://via.placeholder.com/100",
    },
    // Add more favourite items as needed
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full h-3/4 bg-white shadow-xl transition-transform transform ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      } z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Favourites</h2>
        <FiX size={24} className="cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Favourite Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {favouriteItems.length === 0 ? (
          <p className="text-center">You have no favourites yet.</p>
        ) : (
          <ul>
            {favouriteItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center mb-4 border-b pb-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FavouriteSidebar;
