import React from "react";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

function OrderSidebar({ isOpen, toggleSidebar }) {
  const orderItems = useSelector((state) => state.customer?.placeded_orders);
  console.log(orderItems);

  return (
    <div
      className={`fixed top-0 right-0 w-11/12 md:w-3/4 h-full bg-white shadow-xl transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Orders</h2>
        <FiX size={24} className="cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Scrollable Orders */}
      <div className="flex-1 overflow-y-auto p-4">
        {orderItems?.length === 0 ? (
          <p className="text-center">You have no orders yet.</p>
        ) : (
          <ul>
            {orderItems?.map((order) => (
              <li key={order._id} className="mb-4 border-b pb-4">
                {/* Order Header: Order Number, User Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold mb-2">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Username: {order.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mobile: {order.mobileno}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Optional Image for the Order */}
                  <img
                    src={order.order_items[0]?.imageUrl} // Assuming the first item's image
                    alt={order.order_items[0]?.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>

                {/* Order Items List */}
                <ul className="mt-2">
                  {order.order_items.map((item, itemIndex) => (
                    <li
                      key={item._id || itemIndex} // Use unique ID if available, otherwise fallback to index
                      className="flex justify-between items-center text-sm mb-2"
                    >
                      <span className="flex items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded-md mr-2"
                        />
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>

                {/* Order Summary */}
                <div className="mt-2">
                  <p className="font-semibold">
                    Total: ₹{parseFloat(order.total_amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.order_status} | Payment:{" "}
                    {order.payment_status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default OrderSidebar;
