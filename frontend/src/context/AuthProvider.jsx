import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const getValidUserFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        return null;
      }

      return decoded;
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  };

  const [user, setUser] = useState(getValidUserFromToken);
  const loading = false;

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = (reason) => {
    localStorage.removeItem("token");
    setUser(null);

    if (reason) {
      sessionStorage.setItem("authMessage", reason);
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      const hasToken = localStorage.getItem("token");
      if (!hasToken) return;

      logout("Your session expired. Please sign in again.");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    };

    const handleStorageChange = () => {
      setUser(getValidUserFromToken());
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
