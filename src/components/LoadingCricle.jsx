import React from "react";

function LoadingCricle() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div>
        <img src="./loading.gif" alt="Loading..." className="w-[150px] h-[150px]" />
      </div>
    </div>
  );
}

export default LoadingCricle;
