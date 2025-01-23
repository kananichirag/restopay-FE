import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addOrder, fetchAllOrders } from "../store/slices/OrderSlice";
import LoadingCricle from "../components/LoadingCricle";
import { useNavigate } from "react-router-dom";

function MasterChefPage() {
  const dispatch = useDispatch();
  const AllOrders = useSelector((state) => state.orders?.current_orders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const status = useSelector((state) => state.orders?.status);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);

    socket.on("newOrder", (orderData) => {
      dispatch(addOrder(orderData));
    });

    return () => {
      socket.off("newOrder");
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handleStatusChange = (orderId, newStatus) => {
    // dispatch(updateOrderStatus({ orderId, newStatus }));
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-6">
      {status === "loading" && <LoadingCricle />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Chef's Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 py-2 px-4 text-white rounded hover:cursor-pointer hover:bg-red-600 transition"
        >
          Signout
        </button>
      </div>

      <div
        className="overflow-y-auto border rounded shadow-md custom-scrollbar"
        style={{ maxHeight: "630px" }}
      >
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200 sticky top-[0px] z-10">
            <tr>
              <th className="px-4 py-2 text-center">Table Number</th>
              <th className="px-4 py-2 text-center">Order Number</th>
              <th className="px-4 py-2 text-center">Username</th>
              <th className="px-4 py-2 text-center">Order Status</th>
              <th className="px-4 py-2 text-center">Total Amount</th>
              <th className="px-4 py-2 text-center">Update Status</th>
              <th className="px-4 py-2 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {AllOrders?.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="flex flex-col items-center justify-center h-96">
                    <h1 className="text-lg font-semibold text-gray-600">
                      No Orders Found
                    </h1>
                  </div>
                </td>
              </tr>
            ) : (
              AllOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-center">
                      {order.tableNumber}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-2 text-center">{order.username}</td>
                    <td className="px-4 py-2 text-center">
                      {order.order_status}
                    </td>
                    <td className="px-4 py-2 text-center">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Done">Done</option>
                      </select>
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
                      <td colSpan="6" className="px-4 py-2 bg-gray-50">
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
                                <th className="px-4 py-2 text-center">Notes</th>
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
                                    ₹{parseFloat(item.price).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {item.notes || "N/A"}
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

export default MasterChefPage;
