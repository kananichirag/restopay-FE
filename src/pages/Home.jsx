import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    mobileno: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const formSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, mobileno } = formdata;

    // Clear previous errors
    setFormErrors({});

    if (!name || !email || !password || !mobileno) {
      setFormErrors({
        name: !name ? "Name is required" : "",
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
        mobileno: !mobileno ? "Mobile number is required" : "",
      });
      toast.error("Please fill all the fields", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/auth/signup`,
        formdata
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/login");
      } else {
        if (response.data.errors) {
          setFormErrors(response.data.errors);
          setLoading(false);
        }
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <div className="flex flex-col md:flex-row md:mt-20 items-center md:items-start">
          {/* Left Section */}
          <div className="md:w-1/2 w-full">
            <div className="md:pl-20 px-6 md:px-10 mt-6 md:mt-10">
              <h1 className="text-4xl md:text-5xl font-normal text-gray-800 font-serif mb-2 md:leading-tight">
                Restaurant POS <br />
                software made <br />
                simple!
              </h1>
              <p className="mt-8 text-gray-700 text-xl font-semibold">
                Manages all your restaurant operations efficiently so that you
                can focus on growing your brand, like a real boss!
              </p>
              <div className="mt-10">
                <button
                  onClick={scrollToForm}
                  className="bg-red-500 text-white px-10 py-2 rounded-sm hover:bg-red-600 transition duration-200"
                >
                  Book Demo
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2 w-full mt-14 md:mt-0 flex justify-center">
            <img
              src="https://d28ewddc5mocr5.cloudfront.net/images/home/Home-hero_md.webp"
              alt="Restaurant POS Software"
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section id="signup" className="bg-gray-100 py-16" ref={formSectionRef}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Sign Up for a Free Demo
          </h2>

          <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your name"
                onChange={handleFormChange}
              />
              {formErrors.name && (
                <span className="error  text-sm text-red-500 ">
                  {formErrors.name}
                </span>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
                onChange={handleFormChange}
              />
              {formErrors.email && (
                <span className="error  text-sm text-red-500 ">
                  {formErrors.email}
                </span>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
                onChange={handleFormChange}
              />
              {formErrors.password && (
                <span className="erro text-sm text-red-500 ">
                  {formErrors.password}
                </span>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="mobile"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobileno"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your mobile number"
                onChange={handleFormChange}
              />
              {formErrors.mobileno && (
                <span className="error  text-sm text-red-500 ">
                  {formErrors.mobileno}
                </span>
              )}
            </div>

            <div className="flex justify-center">
              <button
                className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition duration-200"
                onClick={handleSubmit}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
