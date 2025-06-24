import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Mainlayout from "./layout/Mainlayout";
import Sidebar from "./pages/admin/Sidebar";
import { Dashboard } from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import Addcourse from "./pages/admin/course/Addcourse";
import Editcourse from "./pages/admin/course/Editcourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import Editlecture from "./pages/admin/lecture/Editlecture";
import CourseDetails from "./pages/student/CourseDetails";
import SearchPage from "./pages/student/Searchpage";
import { AdminRoute, AuthenticatedUser, Protectedroute } from "./components/Protectedroute";
import { ThemeProvider } from "./components/ThemeProvider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element:<AuthenticatedUser> <Login /></AuthenticatedUser>,
      },
      {
        path: "my-learning",
        element:<Protectedroute><MyLearning /></Protectedroute>,
      },
      {
        path: "course-details/:courseId",
        element:<protectedroute><CourseDetails /></protectedroute> ,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "course/search",
        element:<SearchPage/>,
      },
      {
        path: "dashboard",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "admin",
        element:<Sidebar />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <Addcourse />,
          },
          {
            path: "course/:courseId",
            element: <Editcourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <Editlecture />,
          },
        ],
      },
      {
        path: "*",
        element: <h1>404 - Page Not Found</h1>,
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;