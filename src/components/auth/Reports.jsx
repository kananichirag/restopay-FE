import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import axios from "axios";
import LoadingCricle from "../LoadingCricle";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Reports() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(null);
  const [colorMapping, setColorMapping] = useState({});

  const generateLightColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // Keep RGB values high for light colors
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const GetAllRestaurantsReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is Missing");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_BASE_URL}/report/get-report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const fetchedReports = response.data.data;
        setReports(fetchedReports);

        const dynamicColorMapping = {};
        fetchedReports.restaurantBreakdown.forEach((restaurant) => {
          dynamicColorMapping[restaurant.name] = [
            generateLightColor(),
            generateLightColor(),
          ];
        });

        // Set default "all" colors
        dynamicColorMapping["all"] = Object.values(dynamicColorMapping)
          .flat()
          .slice(0, 3); // Take first 3 colors for "all"

        setColorMapping(dynamicColorMapping);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllRestaurantsReports();
  }, []);

  const filteredStats =
    selectedRestaurant === "all"
      ? reports
      : {
          totalRevenue: reports?.restaurantBreakdown.find(
            (r) => r.name === selectedRestaurant
          ).revenue,
          totalOrders: reports?.restaurantBreakdown.find(
            (r) => r.name === selectedRestaurant
          ).orders,
          totalStaff: reports?.restaurantBreakdown.find(
            (r) => r.name === selectedRestaurant
          ).staff,
          totalMenuItems: reports?.totalMenuItems,
          restaurantBreakdown: reports?.restaurantBreakdown.filter(
            (r) => r.name === selectedRestaurant
          ),
        };

  const chartColors =
    selectedRestaurant === "all"
      ? colorMapping.all || ["#FFDDC1", "#FFABAB", "#FFC3A0"]
      : colorMapping[selectedRestaurant] || ["#FFDDC1", "#FFABAB", "#FFC3A0"];

  const revenuePieData = {
    labels: filteredStats?.restaurantBreakdown?.map((r) => r.name) || [],
    datasets: [
      {
        label: "Revenue",
        data: filteredStats?.restaurantBreakdown?.map((r) => r.revenue) || [],
        backgroundColor: chartColors || ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: (chartColors || []).map((color) => `${color}CC`),
      },
    ],
  };

  const orderBarData = {
    labels: filteredStats?.restaurantBreakdown.map((r) => r.name),
    datasets: [
      {
        label: "Orders",
        data: filteredStats?.restaurantBreakdown.map((r) => r.orders),
        backgroundColor: chartColors,
      },
    ],
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Restaurant Reports</h1>
      {loading && <LoadingCricle />}
      {/* Dropdown for selecting a restaurant */}
      {reports && (
        <div>
          <div className="mb-4">
            <label
              className="block mb-2 text-lg font-bold"
              htmlFor="restaurant-select"
            >
              Select a Restaurant:
            </label>
            <select
              id="restaurant-select"
              className="p-2 border rounded-lg"
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              <option value="all">All Restaurants</option>
              {reports?.restaurantBreakdown.map((r) => (
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
              <p className="text-2xl text-green-500 font-bold">
                ${filteredStats.totalRevenue}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold">Total Orders</h2>
              <p className="text-2xl text-blue-500 font-bold">
                {filteredStats.totalOrders}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold">Total Staff</h2>
              <p className="text-2xl text-purple-500 font-bold">
                {filteredStats.totalStaff}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h2 className="text-xl font-bold">Total Menu Items</h2>
              <p className="text-2xl text-orange-500 font-bold">
                {filteredStats.totalMenuItems}
              </p>
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
      )}
    </div>
  );
}

export default Reports;
