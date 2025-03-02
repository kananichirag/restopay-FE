import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  addOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/OrderSlice";
import LoadingCricle from "../components/LoadingCricle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { connectSocket, disconnectSocket, UpdateOrder } from "../socket/socket";
import {
  fetchAllInventorys,
  updateInventory,
} from "../store/slices/InventorySlice";

function MasterChefPage() {
  const dispatch = useDispatch();
  const AllOrders = useSelector((state) => state.orders?.current_orders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const status = useSelector((state) => state.orders?.status);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const [itemdata, setItemdata] = useState({
    name: "",
    quantity: "",
    _id: "",
  });
  const inventory = useSelector((state) => state.inventory?.inventorys);
  const [isOpen, setIsOpen] = useState(false);

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
    dispatch(fetchAllInventorys());
  }, [dispatch]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      if (!orderId || !newStatus) {
        toast.error("Please select a valid status");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/chef/update-status`,
        { orderId, status: newStatus }
      );
      setLoading(false);
      if (response.data.success) {
        dispatch(updateOrderStatus({ orderId, newStatus }));
        dispatch(fetchAllOrders());
        connectSocket();
        UpdateOrder({ orderId, status: newStatus });
        setTimeout(() => {
          disconnectSocket();
        }, 5000);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpdateInventory = (item) => {
    setItemdata({
      name: item.name,
      quantity: item.quantity,
      _id: item._id,
    });
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemdata({ ...itemdata, [name]: value });
  };

  const handleUpdateIventory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_BASE_URL}/inventory/update/${
          itemdata._id
        }`,
        { name: itemdata.name, quantity: itemdata.quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(
          updateInventory({
            name: itemdata.name,
            quantity: itemdata.quantity,
            _id: itemdata._id,
          })
        );
        setIsOpen(false);
      } else {
        toast.error(response.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      setIsOpen(false);
    }
  };
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-6 min-h-screen">
      {status === "loading" && <LoadingCricle />}
      {loading && <LoadingCricle />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Chef's Dashboard
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 py-2 px-6 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "orders"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "inventory"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Inventory
        </button>
      </div>

      {activeTab === "orders" ? (
        <div className="overflow-y-auto border rounded-lg shadow-lg bg-white p-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-300 sticky top-0">
              <tr>
                <th className="p-3 text-center">Table No</th>
                <th className="p-3 text-center">Order No</th>
                <th className="p-3 text-center">Customer</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Update Status</th>
                <th className="p-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {AllOrders?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                AllOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b hover:bg-gray-100">
                      <td className="p-3 text-center">{order.tableNumber}</td>
                      <td className="p-3 text-center">{order.orderNumber}</td>
                      <td className="p-3 text-center">{order.username}</td>
                      <td
                        className={`p-3 text-center font-semibold ${
                          order.order_status === "Preparing"
                            ? "text-yellow-400"
                            : order.order_status === "Done"
                            ? "text-green-600"
                            : "text-blue-600"
                        } `}
                      >
                        {order.order_status}
                      </td>
                      <td className="p-3 text-center font-bold">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 bg-gray-50 outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        >
                          {expandedOrder === order._id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="p-4">
                          <h3 className="font-semibold text-gray-700 mb-2">
                            Order Items:
                          </h3>
                          <table className="w-full border">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="p-3 text-center">Item</th>
                                <th className="p-3 text-center">Category</th>
                                <th className="p-3 text-center">Price</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-center">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items.map((item) => (
                                <tr key={item._id} className="border-b">
                                  <td className="p-3 text-center">
                                    {item.name}
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.category}
                                  </td>
                                  <td className="p-3 text-center">
                                    ₹{parseFloat(item.price).toFixed(2)}
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.notes || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Sender</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory && inventory.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="flex flex-col items-center justify-center h-96">
                        <img
                          src="./no-data.png"
                          alt="No Data"
                          className="w-[520px] h-auto mb-4"
                        />
                        <h1 className="text-lg font-semibold text-gray-600">
                          No Data Available
                        </h1>
                      </div>
                    </td>
                  </tr>
                ) : (
                  inventory &&
                  inventory?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.sender}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.total_amount}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-500 text-white px-2 py-1 mx-1"
                          onClick={(e) => handleUpdateInventory(item)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-2xl font-bold mb-4">Update Inventory</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={itemdata.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={itemdata.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleUpdateIventory}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterChefPage;
