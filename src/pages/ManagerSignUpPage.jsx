import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ManagerSignUpPage = () => {
  const [searchParams] = useSearchParams();
  const [managerDetails, setManagerDetails] = useState(null);
  const [formData, setFormData] = useState({ mobileno: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_BASE_URL}/manager/manager-details?token=${token}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setManagerDetails(response.data.data);
      } catch (err) {
        setError("Invalid or expired token");
      }
    };

    fetchManagerDetails();
  }, [token]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" }); // Clear field error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/manager/signup/${token}`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setError("");
        navigate("/login");
      } else {
        if (response.data.errors) {
          setFieldErrors(response.data.errors); // Display field errors
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!managerDetails && !error) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="bg-gray-100 py-16 min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Manager Signup
        </h2>
        <form
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-200 cursor-not-allowed"
              value={managerDetails?.name || ""}
              disabled
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-200 cursor-not-allowed"
              value={managerDetails?.email || ""}
              disabled
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="mobileno"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileno"
              name="mobileno"
              placeholder="Enter your mobile number"
              className={`w-full px-4 py-2 border ${
                fieldErrors.mobileno ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none`}
              value={formData.mobileno}
              onChange={handleFormChange}
              required
            />
            {fieldErrors.mobileno && (
              <p className="text-red-500 text-sm">{fieldErrors.mobileno}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              className={`w-full px-4 py-2 border ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none`}
              value={formData.password}
              onChange={handleFormChange}
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
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

export default ManagerSignUpPage;
