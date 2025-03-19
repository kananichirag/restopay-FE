import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import LoadingCricle from "../LoadingCricle";
import { useDispatch, useSelector } from "react-redux";
import {
  addRestaurant,
  deleteRestaurant,
  fetchRestaurants,
} from "../../store/slices/RestaurantSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

function Restaurants() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    manager_name: "",
    manager_email: "",
    location: "",
  });
  const { restaurants, status } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const headerGroups = [
    {
      headers: [
        { render: () => "Branche Name", getHeaderProps: () => ({}) },
        { render: () => "Location", getHeaderProps: () => ({}) },
        { render: () => "Manager", getHeaderProps: () => ({}) },
        { render: () => "Manager Email", getHeaderProps: () => ({}) },
        { render: () => "Action", getHeaderProps: () => ({}) },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const ResetForm = () => {
    setFormData({
      name: "",
      manager_name: "",
      manager_email: "",
      location: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Branche Name is required";
    if (!formData.manager_name)
      newErrors.manager_name = "Manager Name is required";
    if (!formData.manager_email) newErrors.manager_email = "Email is required";
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/restaurant/add-restaurant`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(addRestaurant(response.data.data));
        setIsModalOpen(false);
        setLoading(false);
        toast.success(response.data.message);
      } else {
        setIsModalOpen(false);
        setLoading(false);
        toast.error(response.data.message);
        ResetForm();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const DeleteRestairant = async (id) => {
    try {
      if (!id) {
        toast.error("Restairant ID not found");
        return;
      }
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        return;
      }
      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_BASE_URL
        }/restaurant/delete-restaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(deleteRestaurant({ _id: id }));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      {status === "loading" && <LoadingCricle />}
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Branches</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add branche
        </button>
      </div>

      {/* Restaurants Table */}
      <Scrollbars style={{ width: "100%", height: "600px" }}>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup, headerIndex) => (
              <tr key={headerIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={columnIndex}
                    {...column.getHeaderProps()}
                    className="px-4 py-2 text-left border-b"
                  >
                    {column.render()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {restaurants && restaurants.length > 0 ? (
              restaurants.map((restaurant, rowIndex) => (
                <tr
                  key={restaurant._id || rowIndex}
                  className="hover:bg-gray-100"
                >
                  <td className="px-4 py-3 border-b">{restaurant.name}</td>
                  <td className="px-4 py-3 border-b">{restaurant.location}</td>
                  <td className="px-4 py-3 border-b">
                    {restaurant.manager_name}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {restaurant.manager_email}
                  </td>
                  <td className="flex gap-3 px-6 py-3 border-b">
                    <button
                      type="submit"
                      className="text-blue-500"
                      onClick={(e) => DeleteRestairant(restaurant._id)}
                    >
                      <MdDeleteOutline className="text-red-500" size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headerGroups[0].headers.length}
                  className="text-center py-4"
                >
                  No Restaurants Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Scrollbars>

      {/* Add Restaurant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[60%] max-w-4xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-700 p-6 border-b">
              Add branche
            </h2>
            <div className="overflow-y-auto p-6 flex-grow scrollbar-custom">
              <form className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Branche Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm outline-none focus:drop-shadow focus:shadow-red-200"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                {/* Manager Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm outline-none focus:drop-shadow focus:shadow-red-200"
                    required
                  />
                  {errors.manager_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manager_name}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="manager_email"
                    value={formData.manager_email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm outline-none focus:drop-shadow focus:shadow-red-200"
                    required
                  />
                  {errors.manager_email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manager_email}
                    </p>
                  )}
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm outline-none focus:drop-shadow focus:shadow-red-200"
                    required
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </form>
            </div>
            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false), ResetForm();
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddRestaurant}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                {loading ? "Loading..." : " Add "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Restaurants;
