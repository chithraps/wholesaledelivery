'use client';

import axios from "axios";
import { setTruckDriver,logoutTruckDriver } from "./TruckDriverSlice";

export const loginTruckDriver = (truckDriver) => (dispatch) => {
    dispatch(setTruckDriver(truckDriver));
    
};

export const logoutTd = () => async (dispatch) => {
    dispatch(logoutTruckDriver());
    try {
        await axios.post("/api/truckDriver/tdLogout", {}, { withCredentials: true }); 
    } catch (error) {
        console.error("Logout failed:", error);
    }
};