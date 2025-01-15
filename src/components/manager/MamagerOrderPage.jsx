import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllOrders } from "../../store/slices/CustomerSlice";

function ManageOrderPage() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([
    {
      id: "12345",
      customerName: "John Doe",
      contact: "123-456-7890",
      status: "Delivered",
      total: 120.5,
      date: "2025-01-10",
    },
    {
      id: "67890",
      customerName: "Jane Smith",
      contact: "987-654-3210",
      status: "Pending",
      total: 85.75,
      date: "2025-01-11",
    },
  ]);

  const [filter, setFilter] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.id.includes(filter) ||
      order.customerName.toLowerCase().includes(filter.toLowerCase()) ||
      order.status.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  return (
    <div className="p-6">
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

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-center">Order ID</th>
              <th className="px-4 py-2 text-center">Customer Name</th>
              <th className="px-4 py-2 text-center">Contact</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Total</th>
              <th className="px-4 py-2 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="flex flex-col items-center justify-center h-96">
                    <img
                      src="./no-data.png"
                      alt="No Data"
                      className="w-[520px] h-auto mb-4"
                    />
                    <h1 className="text-lg font-semibold text-gray-600">
                      No Orders Found
                    </h1>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2 text-center">{order.id}</td>
                  <td className="px-4 py-2 text-center">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-2 text-center">{order.contact}</td>
                  <td className="px-4 py-2 text-center">{order.status}</td>
                  <td className="px-4 py-2 text-center">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageOrderPage;
