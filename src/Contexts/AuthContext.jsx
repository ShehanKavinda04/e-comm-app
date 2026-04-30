// src/contexts/AuthContext.jsx   ←←←← RENAMED TO .jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../Services/api';
import { getAllUsers } from '../Services/MockDataService'; // Import mock users
import { getUserProfile } from '../Services/userService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to merge token data with rich mock data
  const enrichUser = (decodedToken) => {
    // Attempt to enrich with token data, but always prefer backend results later
    const baseUser = {
      ...decodedToken,
      fullName: decodedToken.fullName || decodedToken.name,
      id: decodedToken.id || decodedToken.userId
    };

    return {
      ...baseUser,
      // Only use the global default if NO image is provided in the token/session
      image: decodedToken.image || decodedToken.profileImageUrl || null
    };
  };

  // Helper to extract clean role from JWT (e.g., ["ROLE_SELLER"] -> "SELLER")
  const extractRole = (decoded) => {
    const raw = (decoded.roles && decoded.roles[0]) || (decoded.role) || "BUYER";
    return raw.replace("ROLE_", "").toUpperCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = extractRole(decoded);
        const enriched = enrichUser(decoded);
        setUser({ ...enriched, role, token });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    if (token) refreshUser(); // Fetch latest from backend after initial load
  }, []);

  const login = async (email, password) => {
    console.log("Attempting login with:", email, password);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Check for 2FA requirement
      if (response.data.twoFaRequired) {
        return { 
          twoFaRequired: true, 
          email: response.data.email, 
          message: response.data.message 
        };
      }

      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      const decoded = jwtDecode(accessToken);
      const role = extractRole(decoded);

      if (!decoded.email) decoded.email = email;

      const enriched = enrichUser(decoded);
      setUser({ ...enriched, role, token: accessToken });
      
      return { role };
    } catch (err) {
      console.error("Login API failed", err);
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data; // Return full response for email/message
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed';
    }
  };

  // Allow updates to user profile (e.g. image)
  const updateUserProfile = (updates) => {
    console.log("Updating user profile in context:", updates);
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      console.log("New user state:", newUser);
      return newUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Detect if the stored token is a real JWT or a mock one
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await getUserProfile();
        console.log("Refreshed user profile data from backend:", data); // Diagnostic log
        const decoded = jwtDecode(token);
        const role = extractRole(decoded);
        
        // Merge latest backend data with stable token identifiers
        setUser(prev => {
          const newUser = {
            ...prev,
            ...decoded,
            ...data,
            role, // Maintain standardized role
            name: data.fullName || prev?.name || decoded.fullName,
            fullName: data.fullName || prev?.fullName || decoded.fullName, 
            displayName: data.displayName || prev?.displayName || decoded.displayName,
            image: data.profileImageUrl !== undefined ? data.profileImageUrl : (prev?.image || decoded.image), 
            id: prev?.id || decoded.id || decoded.userId
          };
          console.log("Updated AuthContext user state:", newUser); // Diagnostic log
          return newUser;
        });
      } catch (err) {
        console.error("Refresh user profile synchronization failed:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserProfile, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};