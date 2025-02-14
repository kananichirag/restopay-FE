import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addInventory } from "../../store/slices/InventorySlice";

function InventoryModal({ isOpen, setIsModalOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    sender: "",
    quantity: "",
    total_amount: null,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.sender || !formData.quantity) {
        toast.error("All fields are required");
        return;
      }
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/inventory/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(addInventory(response.data.inventory));
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Add Inventory</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sender</label>
            <input
              type="text"
              name="sender"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Total Amount</label>
            <input
              type="Number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryModal;
