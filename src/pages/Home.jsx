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

    let errors = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!mobileno) {
      errors.mobileno = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileno)) {
      errors.mobileno = "Mobile number must be exactly 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
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
    <div className="bg-gray-50">
      <Header />

      {/* Hero Section - Modernized */}
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Section - Content */}
            <div className="md:w-1/2 w-full">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 font-serif leading-tight">
                Restaurant POS <span className="text-red-500">software</span>{" "}
                made simple!
              </h1>
              <p className="mt-6 text-gray-700 text-xl leading-relaxed">
                Manages all your restaurant operations efficiently so that you
                can focus on growing your brand, like a real boss!
              </p>
              <div className="mt-10 flex gap-4">
                <button
                  onClick={scrollToForm}
                  className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Book Demo
                </button>
                <button className="bg-white text-red-500 border border-red-500 px-8 py-3 rounded-lg hover:bg-red-50 transition duration-200 font-medium">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="md:w-1/2 w-full mt-10 md:mt-0 flex justify-center">
              <img
                src="https://d28ewddc5mocr5.cloudfront.net/images/home/Home-hero_md.webp"
                alt="Restaurant POS Software"
                className="rounded-lg  max-w-full h-auto transform hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Based on Image 2 */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Trusted by Restaurants Nationwide
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300 w-64">
              <div className="text-red-500 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-red-500">85K</h3>
              <p className="text-gray-600 text-lg mt-2">Happy customers</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300 w-64">
              <div className="text-red-500 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-red-500">60L</h3>
              <p className="text-gray-600 text-lg mt-2">
                Bills processed everyday
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition duration-300 w-64">
              <div className="text-red-500 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-red-500">0%</h3>
              <p className="text-gray-600 text-lg mt-2">Processing errors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Added as requested */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Inventory Management */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-red-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Inventory Management
              </h3>
              <p className="text-gray-600">
                Track stock levels, get alerts for low inventory, and manage
                suppliers all in one place.
              </p>
            </div>

            {/* Reporting Tools */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-red-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Reports & Analytics
              </h3>
              <p className="text-gray-600">
                Gain insights with detailed sales reports, customer analytics,
                and performance metrics.
              </p>
            </div>

            {/* Order Management */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-red-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Order Management
              </h3>
              <p className="text-gray-600">
                Streamline orders from multiple channels including in-store,
                online, and delivery partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Form Section - Redesigned */}
      <section id="signup" className="bg-white py-16" ref={formSectionRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 w-full pl-[60px]">
              <img
                src="./demo-image.webp"
                alt="Schedule a Demo"
                className="rounded-lg  max-w-full"
              />
            </div>

            <div className="md:w-1/2 w-full">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Schedule a Free Demo
                </h2>
                <p className="text-gray-600 mb-8">
                  Get in touch with our team to clarify your queries and see how
                  our POS system can transform your restaurant operations.
                </p>

                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your name"
                      onChange={handleFormChange}
                    />
                    {formErrors.name && (
                      <span className="error text-sm text-red-500">
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your email"
                      onChange={handleFormChange}
                    />
                    {formErrors.email && (
                      <span className="error text-sm text-red-500">
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your password"
                      onChange={handleFormChange}
                    />
                    {formErrors.password && (
                      <span className="error text-sm text-red-500">
                        {formErrors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobileno"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your mobile number"
                      onChange={handleFormChange}
                    />
                    {formErrors.mobileno && (
                      <span className="error text-sm text-red-500">
                        {formErrors.mobileno}
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 font-medium shadow-md"
                      onClick={handleSubmit}
                    >
                      {loading ? "Processing..." : "Schedule My Demo"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Sarah Johnson
                  </h4>
                  <p className="text-gray-600">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "This POS system has completely transformed how we run our
                restaurant. Inventory management is now a breeze and our staff
                loves how easy it is to use."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Michael Chen
                  </h4>
                  <p className="text-gray-600">Cafe Manager</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The reporting features provide incredible insights that have
                helped us optimize our menu and staffing. Our profits have
                increased by 20% since implementing this system."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Priya Patel
                  </h4>
                  <p className="text-gray-600">Food Chain Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Customer support is outstanding. Whenever we have questions,
                they respond quickly and help us solve problems. It's made
                managing multiple locations so much easier."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant Operations?
          </h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful restaurant owners who have streamlined
            their business with our POS solution.
          </p>
          <button
            onClick={scrollToForm}
            className="bg-white text-red-500 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer - Simple */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Restaurant POS</h3>
              <p className="text-gray-400 max-w-md">
                Simplifying restaurant operations with innovative POS solutions
                since 2025.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Integrations</li>
                  <li>Updates</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Documentation</li>
                  <li>Contact Us</li>
                  <li>FAQs</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Blog</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Restaurant POS Software. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
