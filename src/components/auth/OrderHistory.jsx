import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState({});
  const [filteredOrders, setFilteredOrders] = useState({});
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("All");
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_BASE_URL}/report/get-orders`
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
        setRestaurantNames(["All", ...Object.keys(response.data.orders)]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle restaurant filter
  const handleRestaurantChange = (e) => {
    const restaurant = e.target.value;
    setSelectedRestaurant(restaurant);

    if (restaurant === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders({ [restaurant]: orders[restaurant] });
    }
  };

  // Handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchOrder(query);

    let filtered = { ...orders };
    if (selectedRestaurant !== "All") {
      filtered = { [selectedRestaurant]: orders[selectedRestaurant] };
    }

    if (query) {
      for (const restaurant in filtered) {
        filtered[restaurant].orders = orders[restaurant].orders.filter(
          (order) => order.orderNumber.toString().includes(query)
        );
      }
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {/* Dropdown for restaurant selection */}
        <select
          className="border p-2 rounded"
          value={selectedRestaurant}
          onChange={handleRestaurantChange}
        >
          {restaurantNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Search input for order number */}
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Search Order Number"
          value={searchOrder}
          onChange={handleSearchChange}
        />
      </div>

      {/* Order List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order Number</th>
              <th className="border p-2">Restaurant</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(filteredOrders).map((restaurant) =>
              filteredOrders[restaurant].orders.map((order) => (
                <tr key={order.orderNumber} className="border">
                  <td className="border p-2 text-center">
                    {order.orderNumber}
                  </td>
                  <td className="border p-2 text-center">{restaurant}</td>
                  <td className="border p-2 text-center">
                    ₹{order.total_amount}
                  </td>
                  <td className="border p-2 text-center">
                    {order.payment_status}
                  </td>
                  <td className="border p-2 text-center">
                    {order.order_status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;
