import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { FiPlus, FiMinus } from "react-icons/fi";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../store/slices/CustomerSlice";
import { AiOutlineDelete } from "react-icons/ai";

function CartSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.customer?.cart);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrementQuantity = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrementQuantity = (id) => {
    dispatch(decrementQuantity(id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-11/12 md:w-3/4 h-full bg-white shadow-xl transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <FiX size={24} className="cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {cartItems?.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center mb-4"
                >
                  <div className="flex items-center w-full">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">
                        {item.name}
                      </p>
                      <p className="text-sm sm:text-base">
                        ₹{item.price.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDecrementQuantity(item._id)}
                      className="text-gray-600"
                    >
                      <FiMinus size={20} />
                    </button>
                    <span className="text-gray-600">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrementQuantity(item._id)}
                      className="text-gray-600"
                    >
                      <FiPlus size={20} />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 ml-4 text-sm"
                    >
                      <AiOutlineDelete size={24} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Fixed Summary and Checkout Section */}
      {cartItems?.length > 0 && (
        <div className="border-t bg-white">
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-lg">Cart Summary</h3>
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 border-t">
            <button className="bg-red-500 text-white py-2 px-4 w-full rounded-lg">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartSidebar;