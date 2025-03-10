import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Joi from "joi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ForgotPasswordModal from "../components/model/ForgotPasswordModal";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "manager",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    setErrors({ ...errors, [name]: "" }); // Clear error when user changes input
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
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-red-500 flex items-center justify-center">
        <div className="p-4 rounded-lg">
          <img
            src="./online-order-hero_lg.webp"
            alt="Burger"
            className="max-w-[500px] h-auto"
          />
        </div>
      </div>
      <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className={`w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="E-mail"
                value={formData.email}
                onChange={handleFormChange}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Password"
                value={formData.password}
                onChange={handleFormChange}
                disabled={loading}
              />
              <div
                className="absolute top-4 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEye size={20} className="text-gray-600" />
                ) : (
                  <AiFillEyeInvisible size={20} className="text-gray-600" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <select
                id="role"
                name="role"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.role}
                onChange={handleFormChange}
                disabled={loading}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="text-right font-semibold mt-4">
            <button onClick={(e) => setIsOpen(true)}>Forgot password?</button>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

export default Login;
