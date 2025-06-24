import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const COURSE_PURCHASE_API = `${backendURL}/api/v1/purchase`;

export const PurchaseApi = createApi({
  reducerPath: "PurchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({ courseId }) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    updateEnrollment: builder.mutation({
    query: ({ courseId, razorpay_order_id }) => ({
      url: "/update-enrollment",
      method: "PATCH",
      body: { courseId, razorpay_order_id },
    }),
  }),
  getPurchaseStatus: builder.query({
  query: (courseId) => `/course/${courseId}/detail-with-status`,
}),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useUpdateEnrollmentMutation,
  useGetPurchaseStatusQuery
} = PurchaseApi;
