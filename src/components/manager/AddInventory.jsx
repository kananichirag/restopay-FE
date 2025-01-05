import React, { useState } from "react";
import InventoryModal from "../model/InventoryModal";

function AddInventory() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const handleAddInventory = () => {
    setSelectedInventory(null); // Clear selected inventory for adding new
    setIsModalOpen(true);
  };

  const handleEditInventory = (item) => {
    setSelectedInventory(item); // Set selected inventory for editing
    setIsModalOpen(true);
  };

  const handleDeleteInventory = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Inventory</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddInventory}
        >
          Add Inventory
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
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
              inventory.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.stock}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 mx-1"
                      onClick={() => handleEditInventory(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 mx-1"
                      onClick={() => handleDeleteInventory(item.id)}
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
        <InventoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          inventory={selectedInventory}
          onSave={(newItem) => {
            setInventory((prev) =>
              selectedInventory
                ? prev.map((item) => (item.id === newItem.id ? newItem : item))
                : [...prev, { ...newItem, id: Date.now().toString() }]
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default AddInventory;
