import React, { useState } from "react";
import AddOrder from "./cashier/AddOrder";

function ManagerDashboard() {
  const [selectedPage, setSelectedPage] = useState("addMenuItem");

  const renderContent = () => {
    switch (selectedPage) {
      case "addorder":
        return <AddOrder />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <ManagerSidebar onSelect={setSelectedPage} selectedPage={selectedPage} />

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
}

export default ManagerDashboard;
