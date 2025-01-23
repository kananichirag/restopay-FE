import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChefSignUp = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters long.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        toast.error("Token is Missing");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/chef/chef-signup/${token}`,
        formData
      );
      if (response.data.success) {
        toast.success("Chef account created successfully!");
        setFormData({ name: "", email: "", password: "" });
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 py-16 min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Chef Signup
        </h2>
        <form
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none`}
              value={formData.name}
              onChange={handleFormChange}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm">{validationErrors.name}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none`}
              value={formData.email}
              onChange={handleFormChange}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm">{validationErrors.email}</p>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a password"
              className={`w-full px-4 py-2 border ${
                validationErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none`}
              value={formData.password}
              onChange={handleFormChange}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </span>
            {validationErrors.password && (
              <p className="text-red-500 text-sm">
                {validationErrors.password}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChefSignUp;
