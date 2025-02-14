import React, { useEffect, useState } from "react";
import InventoryModal from "../model/InventoryModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllInventorys,
  removeInventory,
} from "../../store/slices/InventorySlice";
import { toast } from "react-toastify";
import axios from "axios";

function AddInventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory?.inventorys);

  useEffect(() => {
    dispatch(fetchAllInventorys());
  }, []);

  const handleDeleteInventory = async (id) => {
    try {
      if (!id) {
        toast.error("ID is required");
        return;
      }

      const token = localStorage.getItem("Authtoken");
      if (!token) {
        toast.error("Token is required");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_BASE_URL}/inventory/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.data.success === true) {
        toast.success(response.data.message);
        dispatch(removeInventory(id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Inventory</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Inventory
        </button>
      </div>

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
                      onClick={(e) => handleDeleteInventory(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <InventoryModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default AddInventory;
