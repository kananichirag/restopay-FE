import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingCricle from "../LoadingCricle";

function Users() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [restaurantFilter, setRestaurantFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const adminId = useSelector((state) => state.auth?.user?._id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_BASE_URL}/report/get-members/${adminId}`
      );
      if (response.data.success) {
        setMembers(response.data.members);
        setFilteredMembers(response.data.members);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching members:", error);
    }
  };

  // Extract unique restaurant names for the dropdown
  const uniqueRestaurants = [
    ...new Set(members.map((member) => member.restaurant)),
  ];

  // Apply filtering
  useEffect(() => {
    let filtered = members;

    if (roleFilter !== "All") {
      filtered = filtered.filter((member) => member.role === roleFilter);
    }

    if (restaurantFilter !== "All") {
      filtered = filtered.filter(
        (member) => member.restaurant === restaurantFilter
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  }, [roleFilter, restaurantFilter, searchQuery, members]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingCricle />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">All Members</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            {/* Role Filter */}
            <select
              className="border p-2 rounded"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Chef">Chef</option>
              <option value="Manager">Manager</option>
            </select>

            {/* Restaurant Filter */}
            <select
              className="border p-2 rounded"
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
            >
              <option value="All">All Branches</option>
              {uniqueRestaurants.map((restaurant, index) => (
                <option key={index} value={restaurant}>
                  {restaurant}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Members List */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Branche</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member._id} className="border">
                      <td className="border p-2 text-center">{member.name}</td>
                      <td className="border p-2 text-center">{member.email}</td>
                      <td className="border p-2 text-center">{member.role}</td>
                      <td className="border p-2 text-center">
                        {member.restaurant}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;
