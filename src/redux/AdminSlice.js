"use client";

import { createSlice } from "@reduxjs/toolkit";

const getAdminFromLocalStorage = () => {
  if (typeof window === "undefined") return null;

  const adminData = localStorage.getItem("admin");
  console.log("Admin Data from localStorage:", adminData);
  if (!adminData || adminData === "undefined") return null;

  try {
    return JSON.parse(adminData);
  } catch (error) {
    console.error("Error parsing admin data:", error);
    return null;
  }
};

const initialState = {
  admin: getAdminFromLocalStorage(),
  adminAccessToken: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("admin", JSON.stringify(action.payload));
      }
    },
    logoutAdmin: (state) => {
      state.admin = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin");
      }
    },
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;

export const selectAdmin = (state) => state.admin;

export default adminSlice.reducer;
