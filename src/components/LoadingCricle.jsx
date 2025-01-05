import React from "react";

function LoadingCricle() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div>
        <img src="./Dual Ball.gif" alt="Loading..." className="w-20 h-20" />
      </div>
    </div>
  );
}

export default LoadingCricle;
