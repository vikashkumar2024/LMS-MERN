import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authapi";
import { courseApi } from "@/features/api/courseapi";
import { PurchaseApi } from "@/features/api/Purchaseapi";

 const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      PurchaseApi.middleware // Ensure PurchaseApi is imported correctly
    ),
});
const initilizeApp=async()=>{
   await store.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
   
}
initilizeApp();
export default store;
