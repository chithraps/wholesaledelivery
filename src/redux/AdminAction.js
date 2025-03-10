'use client';

import { setAdmin,logoutAdmin } from "./AdminSlice";
import axios from "axios";

export const loginAdmin = (admin) => (dispatch) => {
    dispatch(setAdmin(admin));
    
};

export const logoutSuperAdmin = () => async (dispatch) => {
    dispatch(logoutAdmin());
    try {
        console.log("in action")
        await axios.post("/api/admin/logout", {}, { withCredentials: true }); 
    } catch (error) {
        console.error("Logout failed:", error);
    }
};