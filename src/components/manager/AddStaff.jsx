import React, { useState } from "react";
import StaffModal from "../model/StaffModal ";

function AddStaff() {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleAddStaff = () => {
    setSelectedStaff(null); // Clear selected staff for adding new
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember); // Set selected staff for editing
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (id) => {
    setStaff((prev) => prev.filter((staff) => staff.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddStaff}
        >
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-center">Profile</th>
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Contact</th>
              <th className="px-4 py-2 text-center">Shift</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="flex flex-col items-center justify-center h-96">
                    <img
                      src="./no-data.png"
                      alt="No Data"
                      className="w-[520px]  h-auto mb-4"
                    />
                    <h1 className="text-lg font-semibold text-gray-600">
                      No Data Available
                    </h1>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="px-4 py-2 flex items-center justify-center">
                    <img
                      src={member.profile || "/placeholder.png"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">{member.name}</td>
                  <td className="px-4 py-2 text-center">{member.role}</td>
                  <td className="px-4 py-2 text-center">{member.contact}</td>
                  <td className="px-4 py-2 text-center">{member.shift}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 mx-1"
                      onClick={() => handleEditStaff(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 mx-1"
                      onClick={() => handleDeleteStaff(member.id)}
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
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={selectedStaff}
          onSave={(newStaff) => {
            setStaff((prev) =>
              selectedStaff
                ? prev.map((s) => (s.id === newStaff.id ? newStaff : s))
                : [...prev, { ...newStaff, id: Date.now().toString() }]
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default AddStaff;
