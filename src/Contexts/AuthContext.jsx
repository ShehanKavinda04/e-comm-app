// src/contexts/AuthContext.jsx   ←←←← RENAMED TO .jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../Services/api';
import { getAllUsers } from '../Services/MockDataService'; // Import mock users

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to merge token data with rich mock data
  const enrichUser = (decodedToken) => {
    const allUsers = getAllUsers();
    // Try to find by email
    const foundUser = allUsers.find(u => u.email === decodedToken.sub || u.email === decodedToken.email);

    // Fallback for users not in mock data (e.g. test@example.com)
    return {
      ...decodedToken,
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const enriched = enrichUser(decoded); // Enrich
        setUser({ ...enriched, token });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log("Attempting login with:", email, password); // Debug log

    // Mock Login Logic for Test Accounts
    const mockAccounts = {
      "user@gmail.com": { pass: "User_01$", role: "BUYER" },
      "seller@gmail.com": { pass: "Seller_01$", role: "SELLER" },
      "admin@gmail.com": { pass: "Admin_01$", role: "ADMIN" }
    };

    if (mockAccounts[email]) {
      console.log("Mock account found:", mockAccounts[email]);
      if (mockAccounts[email].pass === password) {
        console.log("Password matched for mock account");
        const role = mockAccounts[email].role;
        // Generate a mock JWT token (header.payload.signature)
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ sub: email, email, role, exp: Math.floor(Date.now() / 1000) + (60 * 60) }));
        const token = `${header}.${payload}.mockSignature`;

        localStorage.setItem('token', token);

        const decoded = { sub: email, email, role };
        const enriched = enrichUser(decoded);
        setUser({ ...enriched, token });
        return role.toUpperCase();
      } else {
        console.log("Password mismatch for mock account. Expected:", mockAccounts[email].pass, "Got:", password);
      }
    } else {
      console.log("No mock account found for:", email);
    }

    try {
      const response = await api.post('/api/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      // Manually inject email if missing in decoded token for matching
      if (!decoded.email) decoded.email = email;

      const enriched = enrichUser(decoded); // Enrich
      setUser({ ...enriched, token });
      return decoded.role?.toUpperCase();
    } catch (err) {
      console.error("Login API failed", err);
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      if (!decoded.email) decoded.email = userData.email;

      const enriched = enrichUser(decoded); // Enrich
      setUser({ ...enriched, token });
      return decoded.role?.toUpperCase();
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed';
    }
  };

  // Allow updates to user profile (e.g. image)
  const updateUserProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    // In a real app, we would make an API call here to persist the update
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};