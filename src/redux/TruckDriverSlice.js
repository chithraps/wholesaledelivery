'use client';

import { createSlice } from "@reduxjs/toolkit";


const getTruckDriverFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem('truckDriver')) || null;
    }
    return null;
};

const initialState = {
    truckDriver: getTruckDriverFromLocalStorage(),
    truckDriverAccessToken: null, 
};

const truckDriverSlice = createSlice({
    name: 'truckDriver',
    initialState,
    reducers: {
        setTruckDriver: (state, action) => {
            state.truckDriver = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem('truckDriver', JSON.stringify(action.payload));
            }
        },
        logoutTruckDriver: (state) => {
            state.truckDriver = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem('truckDriver');
            }
        },
    },
});

export const { setTruckDriver, logoutTruckDriver } = truckDriverSlice.actions;

export const selectTruckDriver = (state) => state.truckDriver;

export default truckDriverSlice.reducer;
