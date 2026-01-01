import React, { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../../Services/MockDataService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const data = getAllUsers();
      setUsers(data);
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Seller")
      return matchesSearch && user.role === "Seller";
    if (activeFilter === "Buyer") return matchesSearch && user.role === "Buyer";
    if (activeFilter === "Active")
      return matchesSearch && user.status === "Active";
    if (activeFilter === "Inactive")
      return matchesSearch && user.status === "Inactive";

    return matchesSearch;
  });

  // Move hooks inside component body
  const navigate = useNavigate();

  const handleViewDetails = (user) => {
    navigate(`/admin/user/view/${user.id}`);
    setOpenMenuId(null);
  };

  const handleEditUser = (user) => {
    navigate(`/admin/user/edit/${user.id}`);
    setOpenMenuId(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
      setOpenMenuId(null);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email......"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex justify-end gap-3 mb-6">
        {["All", "Seller", "Buyer", "Active", "Inactive"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-1.5 rounded-full border text-sm font-medium transition-colors cursor-pointer
              ${activeFilter === filter
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black hover:bg-gray-50"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-4 border border-orange-200 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
                <div
                  className={`absolute bottom-1 right-0 w-3.5 h-3.5 rounded-full border-2 border-white 
                  ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500 mb-0.5">{user.email}</p>
                <p className="text-sm font-medium text-gray-900">{user.role}</p>
              </div>
            </div>

            {/* Action */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === user.id ? null : user.id)
                }
                className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                id={`action-button-${user.id}`}
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              {/* Dropdown Menu */}
              {openMenuId === user.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
