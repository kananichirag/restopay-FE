import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Reports() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");

  // Example statistics
  const stats = {
    totalRevenue: 10000,
    totalOrders: 850,
    totalStaff: 50,
    totalMenuItems: 120,
    restaurantBreakdown: [
      { name: "Restaurant A", revenue: 4000, orders: 300, staff: 20 },
      { name: "Restaurant B", revenue: 3500, orders: 250, staff: 15 },
      { name: "Restaurant C", revenue: 2500, orders: 300, staff: 15 },
    ],
  };

  // Color mapping for each restaurant
  const colorMapping = {
    "Restaurant A": ["#FF6384", "#FF9F40"],
    "Restaurant B": ["#36A2EB", "#4BC0C0"],
    "Restaurant C": ["#FFCE56", "#9966FF"],
    all: ["#FF6384", "#36A2EB", "#FFCE56"], // Default colors for all
  };

  // Get filtered stats based on the selected restaurant
  const filteredStats =
    selectedRestaurant === "all"
      ? stats
      : {
          totalRevenue: stats.restaurantBreakdown.find((r) => r.name === selectedRestaurant).revenue,
          totalOrders: stats.restaurantBreakdown.find((r) => r.name === selectedRestaurant).orders,
          totalStaff: stats.restaurantBreakdown.find((r) => r.name === selectedRestaurant).staff,
          totalMenuItems: stats.totalMenuItems,
          restaurantBreakdown: stats.restaurantBreakdown.filter((r) => r.name === selectedRestaurant),
        };

  // Get colors based on selected restaurant
  const chartColors = selectedRestaurant === "all"
    ? colorMapping.all
    : colorMapping[selectedRestaurant];

  // Pie chart data for revenue distribution
  const revenuePieData = {
    labels: filteredStats.restaurantBreakdown.map((r) => r.name),
    datasets: [
      {
        label: "Revenue",
        data: filteredStats.restaurantBreakdown.map((r) => r.revenue),
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors.map((color) => `${color}CC`), // Add transparency for hover
      },
    ],
  };

  // Bar chart data for orders
  const orderBarData = {
    labels: filteredStats.restaurantBreakdown.map((r) => r.name),
    datasets: [
      {
        label: "Orders",
        data: filteredStats.restaurantBreakdown.map((r) => r.orders),
        backgroundColor: chartColors,
      },
    ],
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Restaurant Reports</h1>

      {/* Dropdown for selecting a restaurant */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-bold" htmlFor="restaurant-select">
          Select a Restaurant:
        </label>
        <select
          id="restaurant-select"
          className="p-2 border rounded-lg"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value="all">All Restaurants</option>
          {stats.restaurantBreakdown.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Revenue</h2>
          <p className="text-2xl text-green-500 font-bold">${filteredStats.totalRevenue}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-2xl text-blue-500 font-bold">{filteredStats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Staff</h2>
          <p className="text-2xl text-purple-500 font-bold">{filteredStats.totalStaff}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Menu Items</h2>
          <p className="text-2xl text-orange-500 font-bold">{filteredStats.totalMenuItems}</p>
        </div>
      </div>

      {/* Restaurant-Wise Revenue Distribution (Pie Chart) */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Revenue Distribution</h2>
        <div className="w-full md:w-96 h-96 mx-auto">
          <Pie data={revenuePieData} />
        </div>
      </div>

      {/* Restaurant-Wise Orders (Bar Chart) */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Order Breakdown</h2>
        <div className="w-full h-96">
          <Bar
            data={orderBarData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Reports;
