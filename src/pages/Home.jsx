import React from "react";
import Header from "../components/Header";

function Home() {
  return (
    <div>
      <Header />
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
              Manages all your restaurant operations efficiently so that you can
              focus on growing your brand, like a real boss!
            </p>
            <div className="mt-10">
              <button className="bg-red-500 text-white px-10 py-2 rounded-sm hover:bg-red-600 transition duration-200">
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
  );
}

export default Home;
