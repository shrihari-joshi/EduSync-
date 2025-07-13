import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ViewTeacherCourse from "./pages/Teacher/ViewTeacherCourse.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import { ChakraProvider, ColorModeContext } from "@chakra-ui/react";
import Home from "./pages/Student/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import ProfilePage from "./pages/Student/Profile.jsx";
import TeacherProfile from "./components/TeacherProfile.jsx";
import LandingPage from "./pages/landingPage.jsx";
import Blog from "./pages/Blog.jsx";
import TeacherCourse from "./components/TeacherCourse.jsx";
import ChakraCalendar from "./pages/Student/Calendar.jsx";
import ChatbotInterface from "./pages/Student/ChatBot.jsx";
import AllCoursePage from "./pages/Student/AllCoursePage.jsx";
import Dashboard from "./components/dashboard.jsx";
import CourseDetailsPage from "./components/courses/courses/CourseDetailPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "mycourses",
        element: <AllCoursePage />,
      },
      {
        path: "explore",
        element: <AllCoursePage />,
      },
      {
        path: "mycourses/:id",
        element: <CourseDetailsPage />,
      },
      {
        path: "teacher",
        element: <ViewTeacherCourse />,
      },
      {
        path: "chat",
        element: <ChatbotInterface />,
      },

      {
        path: "calendar",
        element: <ChakraCalendar />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "teacherProfile",
        element: <TeacherProfile />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "teacher-add-course",
        element: <TeacherCourse />,
      },
    ],
    errorElement: <PageNotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    children: [],
    errorElement: <PageNotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
    errorElement: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>

  </StrictMode>
);
