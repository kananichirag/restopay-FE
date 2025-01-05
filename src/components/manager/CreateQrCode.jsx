import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addQrCode,
  deleteQrCode,
  fetchQrCodes,
} from "../../store/slices/QrSlice";
import { AiOutlineDelete } from "react-icons/ai";

function CreateQrCode() {
  const restaurantId = useSelector((state) => state.auth?.user?.restaurant_id);
  const AllQrCodes = useSelector((state) => state.qrCode?.qrCodes);
  const [tableNumber, setTableNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedQrCode, setSelectedQrCode] = useState(null); // New state for QR code modal
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQrCodes());
  }, []);

  const handleAddQrCode = () => {
    setTableNumber("");
    setIsModalOpen(true);
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setError("");

    if (!restaurantId || !tableNumber) {
      setError("Table Number are required.");
      return;
    }

    try {
      const token = localStorage.getItem("Authtoken");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BASE_URL}/manager/qrcode`,
        {
          restaurantId,
          tableNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("QR Code Generated Successfully");
        dispatch(addQrCode(response.data.newQrCode));
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    }
  };

  const handleDeleteQrCode = async (qr) => {
    try {
      if (!qr._id) {
        toast.error("Invalid QR Code");
        return;
      }

      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Authentication token is missing");
        return;
      }
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_BASE_URL}/manager/deleteqr`,
        {
          data: {
            restaurantId: qr.restaurant_id,
            id: qr._id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("QR Code Deleted Successfully");
        dispatch(deleteQrCode({ _id: qr._id }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error deleting QR code:", error);
    }
  };

  const handleQrClick = (code) => {
    setSelectedQrCode(code);
  };

  const closeQrModal = () => {
    setSelectedQrCode(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage QR Codes</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddQrCode}
        >
          Add QR Code
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-center">Table Number</th>
              <th className="px-4 py-2 text-center">QR Code</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {AllQrCodes.length === 0 ? (
              <tr>
                <td colSpan="3">
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
              AllQrCodes?.map((code) => (
                <tr key={code.id} className="border-b">
                  <td className="px-4 py-2 text-center">{code.table_no}</td>
                  <td className="px-4 py-2 flex items-center justify-center">
                    <img
                      src={code.qrcode || "/placeholder.png"}
                      alt="QR Code"
                      className="w-16 h-16 border rounded cursor-pointer"
                      onClick={() => handleQrClick(code)} // Handle click
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className=" text-red-500 hover:bg-fill-red-500"
                      onClick={() => handleDeleteQrCode(code)}
                    >
                      <AiOutlineDelete size={24} className="" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add QR Code</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="tableNumber"
                  className="block text-gray-700 font-medium"
                >
                  Table Number
                </label>
                <input
                  type="text"
                  id="tableNumber"
                  placeholder="Enter Table Number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleGenerateQR}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedQrCode && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">QR Code</h2>
            <div className="flex items-center justify-center">
              <img
                src={selectedQrCode.qrcode || "/placeholder.png"}
                alt="Selected QR Code"
                className="w-64 h-64 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={closeQrModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQrCode;
