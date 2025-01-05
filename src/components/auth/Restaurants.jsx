import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

function Restaurants() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const restaurants = [
    { image: "./restaurant.gif", name: "Restaurant 1" },
    { image: "./restaurant.gif", name: "Restaurant 1" },
    { image: "./restaurant.gif", name: "Restaurant 1" },
    { image: "./restaurant.gif", name: "Restaurant 1" },
  ];

  return (
    <div className="h-[calc(100vh-60px)] p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-5">
        <h1 className="text-lg font-bold mb-4 md:mb-0">Restaurants</h1>

        <div className="w-full md:w-[400px] mb-4 md:mb-0">
          <input
            type="text"
            className="outline-none drop-shadow p-2 rounded-full w-full px-5"
            placeholder="Search restaurant"
          />
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 p-2 text-white text-sm"
        >
          <IoAddCircleOutline size={20} />
          Add Restaurant
        </button>
      </div>

      <div className="flex flex-wrap gap-5 p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className="drop-shadow-md  rounded-lg p-3 w-[calc(20%-1rem)] cursor-pointer sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1rem)]" // Responsive width for different screen sizes
          >
            <img
              src={restaurant.image || "./res-icon.png"}
              alt={restaurant.name || "Default Restaurant"}
              className="h-[180px] w-full object-cover rounded-lg"
            />
            <p className="text-center mt-2 font-medium">
              {restaurant.name || "Unknown Restaurant"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] sm:w-[700px] relative">
            <button
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex justify-center items-center text-gray-600"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b pb-4">
                Add Restaurant
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-600 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter restaurant name"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-600 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter restaurant location"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-600 mb-2">
                    Manager Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter manager email"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-600 mb-2">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter manager name"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Restaurants;
