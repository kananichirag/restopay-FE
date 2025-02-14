import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGooglePay, FaMoneyBillWave } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import {
  addToCustomerOrder,
  emptyCart,
} from "../../store/slices/CustomerSlice";
import LoadingCricle from "../LoadingCricle";
import {
  connectSocket,
  disconnectSocket,
  emitNewOrder,
} from "../../socket/socket";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.customer?.cart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      if (!userName || !mobileNumber) {
        toast.error("Please fill in your name and mobile number.");
        setLoading(false);
        return;
      }
      // if (!selectedPaymentMethod) {
      //   toast.error("Please select a payment method.");
      //   return;
      // }
      const restaurantId = localStorage.getItem("restaurantId");
      const tableNumber = localStorage.getItem("tableNumber");
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_BASE_URL
        }/menu/createorder/${restaurantId}`,
        {
          username: userName,
          mobileno: mobileNumber,
          tableNumber: tableNumber,
          payment_method: selectedPaymentMethod,
          cart: cartItems,
        }
      );
      if (response.data.success && selectedPaymentMethod === "gpay") {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.order.total_amount * 100,
          currency: "INR",
          name: "RestoPay",
          description: `Order #${response.data.order.orderNumber}`,
          order_id: response.data.order.razorpayOrderId,
          handler: async function (response) {
            const verificationResp = await axios.post(
              `${import.meta.env.VITE_REACT_BASE_URL}/menu/verifypayment`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            if (verificationResp.data.success) {
              toast.success(verificationResp.data.message);
            } else {
              toast.error(verificationResp.data.message);
            }
          },
          prefill: {
            name: userName,
            mobileno: mobileNumber,
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        dispatch(emptyCart());
        dispatch(
          addToCustomerOrder({
            orderData: {
              ...response?.data?.order,
              payment_status: "Completed",
            },
          })
        );
        connectSocket();
        emitNewOrder({
          orderData: {
            ...response.data.order,
            payment_status: "Completed",
          },
        });

        setTimeout(() => {
          disconnectSocket();
        }, 5000);
        navigate(`/menu/${restaurantId}/${tableNumber}`);
        setLoading(false);
      } else {
        dispatch(emptyCart());
        dispatch(addToCustomerOrder({ orderData: response?.data.order }));
        connectSocket();
        emitNewOrder({ orderData: response?.data.order });
  
        setTimeout(() => {
          disconnectSocket();
        }, 5000);
        toast.success(response.data.message);
        navigate(`/menu/${restaurantId}/${tableNumber}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleBack = () => {
    const restaurantId = localStorage.getItem("restaurantId");
    const tableNumber = localStorage.getItem("tableNumber");
    if (!tableNumber || !restaurantId) {
      toast.error("Error to Go Back");
      return;
    }
    navigate(`/menu/${restaurantId}/${tableNumber}`, {
      state: { openCart: true },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      {loading && <LoadingCricle />}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-red-500 hover:text-green-800"
        >
          <MdArrowBack className="mr-2" size={24} /> Back to Menu
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="space-y-6">
        {/* User Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 block w-full py-2 px-4 border  rounded-3xl  drop-shadow outline-none focus:outline-red-100"
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="mt-1 block w-full py-2 px-4 borde  rounded-3xl drop-shadow outline-none focus:outline-red-100"
              />
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <ul className="bg-white rounded-lg shadow-md p-4">
            {cartItems?.map((item) => (
              <li
                key={item._id}
                className="flex items-center align-center border-b py-2"
              >
                {/* Name on the left */}
                <span className="flex-1 text-lg font-medium">{item.name}</span>

                {/* Calculation in the center */}
                <span className="flex-1 text-right text-[11px] text-gray-700">
                  ₹{item.price.toFixed(0)} x {item.quantity}
                </span>

                {/* Total on the right */}
                <span className="flex-1 text-right text-sm font-semibold text-green-500">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center  font-semibold">
          <span className="text-red-600 text-xl">Total Amount:</span>
          <span className="text-2xl text-red-600">
            ₹{calculateTotal().toFixed(2)}
          </span>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedPaymentMethod("gpay")}
              className={`flex flex-col items-center p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                selectedPaymentMethod === "gpay"
                  ? "bg-green-100 border border-green-500"
                  : "bg-white"
              }`}
            >
              <FaGooglePay size={32} className="mb-2" />
              Online
            </button>

            <button
              onClick={() => setSelectedPaymentMethod("cash")}
              className={`flex flex-col items-center p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                selectedPaymentMethod === "cash"
                  ? "bg-green-100 border border-green-500"
                  : "bg-white"
              }`}
            >
              <FaMoneyBillWave size={32} className="mb-2" />
              Cash
            </button>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          type="submit"
          onClick={handlePayment}
          className="bg-green-600 text-white py-3 px-6 w-full rounded-lg mt-4 font-semibold text-lg hover:bg-green-700"
        >
          Proceed to Pay ₹{calculateTotal().toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
