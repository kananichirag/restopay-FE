import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "cashier",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email address",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    role: Joi.string().valid("admin", "manager", "cashier", "chef").required(),
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const validationErrors = {};
    error.details.forEach((detail) => {
      validationErrors[detail.path[0]] = detail.message;
    });
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const { role, ...loginData } = formData;
      let apiRoute = `${import.meta.env.VITE_REACT_BASE_URL}/auth/login`;
      if (role === "manager") {
        apiRoute = `${import.meta.env.VITE_REACT_BASE_URL}/manager/login`;
      } else if (role === "cashier") {
        apiRoute = `${import.meta.env.VITE_REACT_BASE_URL}/cashier/login`;
      } else if (role === "chef") {
        apiRoute = `${import.meta.env.VITE_REACT_BASE_URL}/chef/chef-login`;
      }

      const res = await axios.post(apiRoute, loginData);
      if (res.data.success === false) {
        setLoading(false);
        toast.error(res.data.message);
        return;
      }
      if (role === "manager") {
        localStorage.setItem("Authtoken", res.data.data.Manager_token);
        dispatch(login(res.data.data.manager));
      } else if (role === "cashier") {
        localStorage.setItem("Authtoken", res.data.data.Cashier_token);
        dispatch(login(res.data.data.cashier));
      } else if (role === "chef") {
        localStorage.setItem("Authtoken", res.data.Chef_token);
        dispatch(login(res.data.chef));
      } else {
        localStorage.setItem("Authtoken", res.data.data.token);
        dispatch(login(res.data.data.user));
      }
      setLoading(false);
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "manager") {
        navigate("/manager");
      } else if (role === "cashier") {
        navigate("/cashier-panel");
      } else if (role === "chef") {
        navigate("/chef-order");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-100 py-16 min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Login
        </h2>

        <form
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Email Field */}
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
              autoComplete="email"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleFormChange}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
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
              autoComplete="current-password"
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleFormChange}
              disabled={loading}
            />
            <div
              className="absolute top-9 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEye size={20} className="text-gray-600" />
              ) : (
                <AiFillEyeInvisible size={20} className="text-gray-600" />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Role Selector */}
          <div className="mb-10">
            <label
              htmlFor="role"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.role}
              onChange={handleFormChange}
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
