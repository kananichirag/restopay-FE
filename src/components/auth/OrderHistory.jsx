import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingCricle from "../LoadingCricle";
import { useSelector } from "react-redux";
import { ChevronDown, Search } from "lucide-react";

function OrderHistory() {
  const [orders, setOrders] = useState({});
  const [filteredOrders, setFilteredOrders] = useState({});
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("All");
  const [searchOrder, setSearchOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const adminId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_BASE_URL}/report/get-orders/${adminId}`
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
        setRestaurantNames(["All", ...Object.keys(response.data.orders)]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching orders:", error);
    }
  };

  const handleRestaurantChange = (e) => {
    const restaurant = e.target.value;
    setSelectedRestaurant(restaurant);

    if (restaurant === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders({ [restaurant]: orders[restaurant] });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchOrder(query);

    if (!query) {
      setFilteredOrders(orders);
      return;
    }

    let filtered = {};

    Object.keys(orders).forEach((restaurant) => {
      const matchingOrders = orders[restaurant].orders.filter((order) =>
        order.orderNumber.toString().includes(query)
      );

      if (matchingOrders.length > 0) {
        filtered[restaurant] = {
          ...orders[restaurant],
          orders: matchingOrders,
        };
      }
    });

    setFilteredOrders(filtered);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {loading && <LoadingCricle />}
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>

        {/* Filters Container */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex space-x-4">
            {/* Restaurant Dropdown */}
            <div className="relative flex-grow">
              <select
                className="w-full appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRestaurant}
                onChange={handleRestaurantChange}
              >
                {restaurantNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search Order Number"
                value={searchOrder}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {Object.keys(filteredOrders).length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-xl text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['Order Number', 'Branch', 'Total Amount', 'Payment Status', 'Order Status'].map((header) => (
                    <th 
                      key={header} 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(filteredOrders).map((restaurant) =>
                  filteredOrders[restaurant].orders.length > 0
                    ? filteredOrders[restaurant].orders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {restaurant}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{order.total_amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.payment_status.toLowerCase() === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs bg-green-300 leading-5 font-semibold rounded-full ${
                              getStatusColor(order.order_status)
                            }`}>
                              {order.order_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    : null
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;