import React from "react";

function Navbar() {
  return (
    <div className="bg-white drop-shadow-md p-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold"></h1>
        <div className="flex items-center space-x-4">
          <div className="">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJdauKmK3JP7AREOlnMCR8e6f5i1-Ci0cNkA&s"
              alt="User"
              className="h-[36px] w-auto rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
