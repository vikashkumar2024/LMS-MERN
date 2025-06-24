import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { use } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const COURSE_API = `${backendURL}/api/v1/course`;

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ['Refetch-Creator_course', "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ title, category }) => ({
        url: "/create",
        method: "POST",
        body: { title, category },
      }),
      invalidatesTags: ['Refetch-Creator_course'],
    }),
    getSearchCourse:builder.query({
      query: ({searchQuery, categories, sortByPrice}) => {
        // Build qiery string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`

        // append cateogry 
        if(categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`; 
        }

        // Append sortByPrice is available
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; 
        }

        return {
          url:queryString,
          method:"GET", 
        }
      }
    }),
    getAllcreatorCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ['Refetch-Creator_course'],
    }),


    Editcourse: builder.mutation({
    query: ({ formData, courseId }) => ({
    url: `/${courseId}/edit`, 
    method: "PUT",
    body: formData,
  }),
}),

    getcourseByid: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),

    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),

    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ['Refetch_Lecture'],
    }),

    editLecture: builder.mutation({
      query: ({ courseId, lectureId, lectureTitle, videoInfo, isPreviewFree }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),
    removelecture: builder.mutation({
      query: ({ lectureId }) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Refetch_Lecture']
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      })
    }),
    publishcourse: builder.mutation({
      query: ({ courseId, publish }) => ({
        url: `/course/${courseId}/publish`,
        method: "PUT",
        body: { publish },
      }),
    }),
    getAllCourses: builder.query({
    query: () => ({
      url: "/all/course",
      method: "GET",
    }),
}),
  getEnrolledCourses: builder.query({
  query: () => ({
    url: "/enrolled-courses",
    method: "GET",
  }),
}),


  }),
});

// Export correct hooks
export const {
  useCreateCourseMutation,
  useGetAllcreatorCoursesQuery,
  useEditcourseMutation,
  useGetcourseByidQuery,
  useCreateLectureMutation,
  useEditLectureMutation,
  useGetCourseLectureQuery,
  useRemovelectureMutation,
  useGetLectureByIdQuery,
usePublishcourseMutation,
  useGetAllCoursesQuery,
  useGetEnrolledCoursesQuery,
  useGetSearchCourseQuery,
} = courseApi;