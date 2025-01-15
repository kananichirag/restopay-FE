import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCustomerMenuItems,
} from "../store/slices/CustomerSlice";
import { toast } from "react-toastify";
import CartSidebar from "../components/User/CartSidebar";
import { CiHeart } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import OrderSidebar from "../components/User/OrderSidebar";
import FavouriteSidebar from "../components/User/FavoutiteSidebar";

function RestaurantMenuPage() {
  const { restaurantId, tableNumber } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const MenuItems = useSelector((state) => state.customer?.menu?.items);
  const CartCount = useSelector((state) => state.customer?.cart?.length);
  const OrderCount = useSelector((state) => state.customer?.orders?.length);

  useEffect(() => {
    if (location.state?.openCart) {
      setCartSidebarOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("restaurantId", restaurantId);
    localStorage.setItem("tableNumber", tableNumber);
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchCustomerMenuItems(restaurantId));
    }
  }, [restaurantId]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceOrder, setPriceOrder] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [isOrderSidebarOpen, setOrderSidebarOpen] = useState(false);
  const [isFavouriteSidebarOpen, setFavouriteSidebarOpen] = useState(false);

  const filteredItems = MenuItems?.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (priceOrder === "LowToHigh") return a.price - b.price;
    if (priceOrder === "HighToLow") return b.price - a.price;
    return 0;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToCart = (id) => {
    const item = MenuItems?.find((menuItem) => menuItem._id === id);
    if (item) {
      if (item.isAvailable) {
        const itemWithQuantity = { ...item, quantity: 1 };
        dispatch(addToCart(itemWithQuantity));
        toast.success(`${item.name} added to cart!`, {
          position: "top-left",
          style: {
            color: "green",
            fontSize: "0.875rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            maxWidth: "70%",
            marginTop: "1rem",
          },
        });
      } else {
        toast.error("This item is currently unavailable.");
      }
    } else {
      toast.error("Item not found.");
    }
  };

  const toggleCartSidebar = () => {
    setCartSidebarOpen(!isCartSidebarOpen);
    setOrderSidebarOpen(false);
    setFavouriteSidebarOpen(false);
  };

  const toggleOrderSidebar = () => {
    setOrderSidebarOpen(!isOrderSidebarOpen);
    setCartSidebarOpen(false);
    setFavouriteSidebarOpen(false);
  };

  const toggleFavouriteSidebar = () => {
    setFavouriteSidebarOpen(!isFavouriteSidebarOpen);
    setCartSidebarOpen(false);
    setOrderSidebarOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-0 p-4 bg-red-500 drop-shadow-lg">
        <div className="relative  max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for items..."
            className="w-full px-5 py-2 border rounded-full shadow-md outline-none"
          />
          <CiSearch
            size={24}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>
        <div className="flex text-sm relative">
          {/* Cart Icon */}
          <FiShoppingCart
            size={28}
            className="text-white cursor-pointer"
            onClick={toggleCartSidebar} // Toggle sidebar on click
          />
          <span className="absolute top-[-8px] right-[-8px] bg-green-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {CartCount}
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-center align-center gap-2 mt-2 border border-red-400 border-b-4 rounded-full p-2 m-2">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-5.293l-6-6A1 1 0 011 6V4z"
            />
          </svg>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block font-semibold">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-1 border rounded-lg shadow-sm outline-none shadow-red-300 bg-white"
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block font-semibold">Price</label>
          <select
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
            className="px-4 py-1 border rounded-lg shadow-sm shadow-red-300 outline-none bg-white"
          >
            <option value="None">None</option>
            <option value="LowToHigh">Low to High</option>
            <option value="HighToLow">High to Low</option>
          </select>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-20">
        {filteredItems?.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-36 object-cover rounded-lg mb-1"
            />
            <div className="p-4">
              <h2 className="font-medium text-lg">{item.name}</h2>
              <p className="text-gray-700 font-semibold mt-2">
                ₹{item.price.toFixed(2)}
              </p>
            </div>
            <div className="p-2">
              {item.isAvailable ? (
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full w-full"
                >
                  Add to Cart
                </button>
              ) : (
                <p className="text-red-500 font-semibold text-center">
                  Out of Stock
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar - Mobile only */}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        toggleSidebar={toggleCartSidebar}
      />

      <OrderSidebar
        isOpen={isOrderSidebarOpen}
        toggleSidebar={toggleOrderSidebar}
      />

      <FavouriteSidebar
        isOpen={isFavouriteSidebarOpen}
        toggleSidebar={toggleFavouriteSidebar}
      />

      {/* Sticky Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-50  py-2 flex justify-around items-center border-t-2 border-gray-300">
        {/* Order Button */}
        <button
          className="px-4 rounded-full flex flex-col items-center gap-2"
          onClick={toggleFavouriteSidebar}
        >
          <CiHeart className="text-red-500" size={25} />
          <span className="text-[12px]">Favourite</span>
        </button>

        {/* Cart Button */}
        <button
          className="px-4 rounded-full flex flex-col items-center gap-2"
          onClick={toggleOrderSidebar}
        >
          {OrderCount !== 0 && (
            <span className="absolute top-[1px] right-[140px] bg-green-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {OrderCount}
            </span>
          )}

          <IoBagHandleOutline className="text-red-500" size={25} />
          <span className="text-[12px]">Orders</span>
        </button>

        <button
          className="px-4 rounded-full flex flex-col items-center gap-2"
          onClick={toggleCartSidebar}
        >
          {CartCount !== 0 && (
            <span className="absolute top-[1px] right-[32px] bg-green-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {CartCount}
            </span>
          )}
          <FiShoppingCart className="text-red-500" size={25} />
          <span className="text-[12px]">Cart</span>
        </button>
      </div>
    </div>
  );
}

export default RestaurantMenuPage;
