import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const validatePassword = () => {
    let valid = true;
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/auth/reset-password`,
        {
          password,
          token,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred while resetting the password.");
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
        {/* Envelope-like design */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-blue-500 rounded-t-lg rounded-b-none flex items-center justify-center">
          <div className="w-full h-0 border-x-[40px] border-x-transparent border-b-[40px] border-b-white absolute -bottom-5"></div>
          <div className="text-white text-5xl drop-shadow mb-4">🔐</div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Forgot Password?
          </h2>
          <p className="text-gray-500 mb-6">Enter your new password below</p>

          <form onSubmit={handleSubmit}>
            {/* Password input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
