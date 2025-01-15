import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import OrderHistory from "./OrderHistory";
import Reports from "./Reports";
import Restaurants from "./Restaurants";
import Users from "./Users";

function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState("orderHistory");

  // Dynamically render the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case "orderHistory":
        return <OrderHistory />;
      case "reports":
        return <Reports />;
      case "restaurants":
        return <Restaurants />;
      case "users":
        return <Users />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar onSelect={setSelectedPage} selectedPage={selectedPage} />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
