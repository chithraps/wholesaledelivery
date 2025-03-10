'use client';

import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../redux/AdminSlice";
import tdReducer from "../redux/TruckDriverSlice"

export const store = configureStore({
    reducer:{
        admin : adminReducer,
        truckDriver : tdReducer,
    }
})