import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAllUsers, updateUser } from '../../../../Services/MockDataService';
import { ArrowLeft, Save } from "lucide-react";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Buyer",
    status: "Active",
  });

  useEffect(() => {
    const users = getAllUsers();
    const foundUser = users.find((u) => u.id === parseInt(id));
    if (foundUser) {
      setFormData(foundUser);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(parseInt(id), formData);
    alert("User details updated successfully!");
    navigate("/admin");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-gray-500 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to User Management
        </Link>
      </div>

      <div className="max-w-2xl mx-auto text-black bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link
              to="/admin"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
