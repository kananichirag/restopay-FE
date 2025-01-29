import React, { useState } from "react";
import ManagerSidebar from "./manager/ManagerSidebar";
import AddMenuItem from "./manager/AddMenuitem";
import AddStaff from "./manager/AddStaff";
import AddInventory from "./manager/AddInventory";
import CreateQrCode from "./manager/CreateQrCode";
import MamagerOrderPage from "./manager/MamagerOrderPage";

function ManagerDashboard() {
  const [selectedPage, setSelectedPage] = useState("addMenuItem");

  const renderContent = () => {
    switch (selectedPage) {
      case "addMenuItem":
        return <AddMenuItem />;
      case "addStaff":
        return <AddStaff />;
      case "inventory":
        return <AddInventory />;
      case "qrcode":
        return <CreateQrCode />;
      case "orderpage":
        return <MamagerOrderPage />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ManagerSidebar onSelect={setSelectedPage} selectedPage={selectedPage} />

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 min-h-screen overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

export default ManagerDashboard;
