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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Inventory name is required";
    if (!formData.sender) newErrors.sender = "Sender name is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.total_amount)
      newErrors.total_amount = "Total amount is required";
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      if (!formData.name || !formData.sender || !formData.quantity) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        setLoading(false);
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
        setLoading(false);
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
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
            {errors.sender && (
              <p className="text-red-500 text-sm mt-1">{errors.sender}</p>
            )}
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
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
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
            {errors.total_amount && (
              <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>
            )}
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
              {loading ? "Loading..." : "Add Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryModal;
