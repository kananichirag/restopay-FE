import React, { useEffect, useState } from "react";
import StaffModal from "../model/StaffModal ";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStaffMember,
  fetchAllStaffMembers,
} from "../../store/slices/StaffSlice";
import LoadingCricle from "../LoadingCricle";
import axios from "axios";
import { toast } from "react-toastify";

function AddStaff() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const status = useSelector((state) => state.staff?.status);
  const StaffMembers = useSelector((state) => state.staff?.staff_members);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStaffMembers());
  }, []);

  const handleAddStaff = () => {
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Authtoken");
      if (!token) {
        token.error("Token is Missing");
        setLoading(false);
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_BASE_URL}/staff/delete-members/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(deleteStaffMember(id));
        setLoading(false);
        toast.success(response.data.message);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      {(status === "loading" && <LoadingCricle />) ||
        (loading && <LoadingCricle />)}
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
            {StaffMembers?.length === 0 ? (
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
              StaffMembers?.map((member) => (
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
                  <td className="px-4 py-2 text-center">{member.contect}</td>
                  <td className="px-4 py-2 text-center">{member.shift}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 mx-1"
                      onClick={() => handleDeleteStaff(member._id)}
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

      {isModalOpen && <StaffModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default AddStaff;
