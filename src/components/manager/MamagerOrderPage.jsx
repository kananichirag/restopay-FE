import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addOrder, fetchAllOrders } from "../../store/slices/OrderSlice";
import LoadingCricle from "../LoadingCricle";

function ManageOrderPage() {
  const dispatch = useDispatch();
  const AllOrders = useSelector((state) => state.orders?.current_orders);
  const [filter, setFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const status = useSelector((state) => state.orders?.status);

  useEffect(() => {
    // Connect to socket
    const socket = io(import.meta.env.VITE_SOCKET_URL);

    // Listen for new orders
    socket.on("connect", () => {});

    socket.on("newOrder", (orderData) => {
      dispatch(addOrder(orderData));
    });

    // Cleanup on component unmount
    return () => {
      socket.off("newOrder");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = AllOrders?.filter(
    (order) =>
      order._id.includes(filter) ||
      order.username.toLowerCase().includes(filter.toLowerCase()) ||
      order.order_status.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="p-6">
      {status === "loading" && <LoadingCricle />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Online Orders</h1>
        <input
          type="text"
          placeholder="Search orders..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />
      </div>

      <div
        className="overflow-y-auto border rounded shadow-md custom-scrollbar"
        style={{ maxHeight: "630px" }}
      >
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200 sticky top-[0px] z-10">
            <tr>
              <th className="px-4 py-2 text-center">Table Number</th>
              <th className="px-4 py-2 text-center">Username</th>
              <th className="px-4 py-2 text-center">Contact</th>
              <th className="px-4 py-2 text-center">Order Status</th>
              <th className="px-4 py-2 text-center">Payment Status</th>
              <th className="px-4 py-2 text-center">Payment Method</th>
              <th className="px-4 py-2 text-center">Total Amount</th>
              <th className="px-4 py-2 text-center">Date</th>
              <th className="px-4 py-2 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="flex flex-col items-center justify-center h-96">
                    <h1 className="text-lg font-semibold text-gray-600">
                      No Orders Found
                    </h1>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-center">
                      {order.tableNumber}
                    </td>
                    <td className="px-4 py-2 text-center">{order.username}</td>
                    <td className="px-4 py-2 text-center">{order.mobileno}</td>
                    <td className="px-4 py-2 text-center">
                      {order.order_status}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {order.payment_status}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {order.payment_method}
                    </td>
                    <td className="px-4 py-2 text-center">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        {expandedOrder === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="9" className="px-4 py-2 bg-gray-50">
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Order Items:
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-center">Name</th>
                                <th className="px-4 py-2 text-center">
                                  Category
                                </th>
                                <th className="px-4 py-2 text-center">Price</th>
                                <th className="px-4 py-2 text-center">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-center">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items.map((item) => (
                                <tr key={item._id} className="border-b">
                                  <td className="px-4 py-2 text-center">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {item.category}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    ${parseFloat(item.price).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {item.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageOrderPage;
