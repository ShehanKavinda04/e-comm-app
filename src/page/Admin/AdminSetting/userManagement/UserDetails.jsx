import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllUsers } from '../../../../Services/MockDataService';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = getAllUsers();
    const foundUser = users.find((u) => u.id === parseInt(id));
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return <div className="p-6">Loading or user not found...</div>;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={user.image}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            />
            <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white 
                    ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
          <p className="text-gray-500 mb-4">{user.email}</p>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-700`}
          >
            {user.role}
          </span>
        </div>

        {/* Detailed Info */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            User Information
          </h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-medium text-gray-900">{user.role}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              {user.status === "Active" ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-1" />
              )}
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p
                  className={`font-medium ${user.status === "Active" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {user.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
