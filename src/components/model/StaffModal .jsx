import React, { useState, useEffect } from "react";
import Joi from "joi";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addStaffMember } from "../../store/slices/StaffSlice";

function StaffModal({ onClose }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contect: "",
    profile: null,
    shift: "morning",
  });
  const dispatch = useDispatch();
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().label("Name"),
    role: Joi.string().min(3).max(50).required().label("Role"),
    contect: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .label("Contact")
      .messages({
        "string.pattern.base": "contect must be a 10-digit number",
      }),
    shift: Joi.string().valid("morning", "noon").required().label("Shift"),
  });

  const validate = () => {
    const result = schema.validate(formData, { abortEarly: false });
    if (!result.error) return null;

    const validationErrors = {};
    result.error.details.forEach((item) => {
      validationErrors[item.path[0]] = item.message;
    });
    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile: file,
      });
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      contect: "",
      profile: null,
      shift: "morning",
    });
    setUploadedImage(null);
    setErrors({});
    onClose();
  };

  const handleAddMember = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const validationErrors = validate();
      if (validationErrors) {
        setErrors(validationErrors);
      }

      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is Missing");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("contect", formData.contect);
      formDataToSend.append("shift", formData.shift);
      if (formData.profile) {
        formDataToSend.append("profile", formData.profile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/staff/add-member`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        dispatch(addStaffMember(response.data.staffmember));
        setLoading(false);
        toast.success(response.data.message);
        resetForm();
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Add Staff</h2>
        <form onSubmit={handleAddMember}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contect"
              value={formData.contect}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.contect && (
              <p className="text-red-500 text-sm">{errors.contect}</p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-400 transition">
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setFormData({ ...formData, profile: null });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profileUpload"
                  />
                  <label
                    htmlFor="profileUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 mb-2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <span className="text-center text-sm">
                      Drag & Drop or{" "}
                      <span className="text-blue-500 underline">Browse</span>
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Shift Time</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="morning">Morning</option>
              <option value="noon">Noon</option>
            </select>
            {errors.shift && (
              <p className="text-red-500 text-sm">{errors.shift}</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
            >
              {loading ? "Loading..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffModal;
