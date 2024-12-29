import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiEdit } from "react-icons/fi"; // Edit icon from react-icons
import LoadingCricle from "../LoadingCricle";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  deleteItem,
  fetchMenuItems,
} from "../../store/slices/MenuSlice";

function AddMenuItem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setisUpdateModealOpen] = useState(false);
  console.log(isUpdateModalOpen);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
    isAvailable: true,
    image: null,
  });
  const [editingItem, setEditingItem] = useState(null);
  const disptach = useDispatch();
  const status = useSelector((state) => state.menu.status);
  const restaurantId = useSelector((state) => state.auth?.user?.restaurant_id);
  const MenuItems = useSelector((state) => state.menu?.menu?.items);

  useEffect(() => {
    disptach(fetchMenuItems());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      quantity: "",
      description: "",
      isAvailable: true,
      image: null,
    });
    setIsModalOpen(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("Authtoken");

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/menu/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        disptach(addItem(res.data?.data));
        toast.success(res.data?.message);
        setIsModalOpen(false);
        setLoading(false);
        setFormData({
          name: "",
          price: "",
          category: "",
          quantity: "",
          description: "",
          isAvailable: true,
          image: null,
        });
      } else {
        toast.error(res.data.message);
        setIsModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setIsModalOpen(false);
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem("Authtoken");
      if (!restaurantId) {
        toast.error("Restaurant ID is missing");
        return;
      }
      const res = await axios.delete(
        `${import.meta.env.VITE_REACT_BASE_URL}/menu/deleteitem`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            restaurantId,
            ItemId: id,
          },
        }
      );
      if (res.data.success) {
        disptach(deleteItem(id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item.");
    }
  };

  const handleEditClick = (item) => {
    setFormData(item);
    setEditingItem(item);
    setisUpdateModealOpen(true);
  };

  // Table Columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Availability",
        accessor: "isAvailable",
        Cell: ({ value }) => (value ? "Available" : "Not Available"),
      },
      {
        Header: "Image",
        accessor: "imageUrl",
        Cell: ({ value }) => (
          <img src={value} alt="Item" className="w-20 h-20" />
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex gap-5">
            <button
              onClick={() => handleEditClick(row.original)}
              className="text-blue-500 hover:text-blue-600"
            >
              <FiEdit />
            </button>
            <button onClick={() => handleDeleteItem(row.original)}>
              <MdDeleteOutline className="text-red-500" size={20} />
            </button>
          </div>
        ),
      },
    ],
    [MenuItems]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: MenuItems || [],
    });

  return (
    <div className="p-6">
      {status === "loading" && <LoadingCricle />}
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {/* Menu Items Table */}
      <Scrollbars style={{ width: "100%", height: "600px" }}>
        <table {...getTableProps()} className="min-w-full table-auto">
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup, headerIndex) => (
              <tr key={headerIndex} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    key={columnIndex} // Key directly passed here
                    {...column.getHeaderProps()}
                    className="px-4 py-2 text-left border-b"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  key={rowIndex} // Key directly passed here
                  {...row.getRowProps()}
                  className="hover:bg-gray-100"
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={cellIndex} // Key directly passed here
                      {...cell.getCellProps()}
                      className="px-4 py-2 border-b"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Scrollbars>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[60%] max-w-4xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-700 p-6 border-b">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <div className="overflow-y-auto p-6 flex-grow scrollbar-custom">
              <form className="space-y-6">
                {/* Form Fields */}
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.qty}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    rows="3"
                  />
                </div>
                {/* Availability */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="h-5 w-5 rounded focus:ring focus:ring-blue-300"
                  />
                  <label className="text-sm font-medium text-gray-600">
                    Available
                  </label>
                </div>
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-400 transition">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 mb-2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <span className="text-center text-sm">
                      Drag & Drop or{" "}
                      <span className="text-blue-500 underline">Browse</span>
                    </span>
                  </label>
                </div>
              </form>
            </div>
            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                {loading ? "Loading..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[60%] max-w-4xl max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-700 p-6 border-b">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <div className="overflow-y-auto p-6 flex-grow scrollbar-custom">
              <form className="space-y-6">
                {/* Form Fields */}
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                    rows="3"
                  />
                </div>
                {/* Availability */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="h-5 w-5 rounded focus:ring focus:ring-blue-300"
                  />
                  <label className="text-sm font-medium text-gray-600">
                    Available
                  </label>
                </div>
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-400 transition">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 mb-2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <span className="text-center text-sm">
                      Drag & Drop or{" "}
                      <span className="text-blue-500 underline">Browse</span>
                    </span>
                  </label>
                </div>
              </form>
            </div>
            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                type="button"
                onClick={() => setisUpdateModealOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenuItem;
