import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import { authApi } from "../features/api/authapi"; // ✅ named import

import { courseApi } from "@/features/api/courseapi"
import { PurchaseApi } from "@/features/api/Purchaseapi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [PurchaseApi.reducerPath]: PurchaseApi.reducer, // ✅ named import
  auth: authReducer, // only once
});

export default rootReducer;
