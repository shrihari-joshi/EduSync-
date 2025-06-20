import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ViewTeacherCourse } from "./pages/index.js";
import { PageNotFound } from "./components/index.js";
import { ChakraProvider, ColorModeContext } from "@chakra-ui/react";
import Home from "./pages/Student/Home.jsx";
import Courses from "./pages/Student/Courses.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import MyCourses from "./pages/Student/MyCourses.jsx";
import Quiz from "./pages/Student/Quiz.jsx";
import ProfilePage from "./pages/Student/Profile.jsx";
import CoursePage from "./pages/Student/CourseDetails.jsx";
import TeacherProfile from "./components/TeacherProfile.jsx";
import LandingPage from "./pages/landingPage.jsx";
import Blog from "./pages/Blog.jsx";
import TeacherCourse from "./components/TeacherCourse.jsx";
import SignLanguageCourse from "./pages/SignLangugae/signLangCoursePage.jsx";
import ChakraCalendar from "./pages/Student/Calendar.jsx";
import Chat from "./pages/Student/Chat.jsx";
import ChatbotInterface from "./pages/Student/ChatBot.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
        path: "quiz/:id/:idx",
        element: <Quiz />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "course-details/:id",
        element: <CoursePage />,
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
      {
        path: "signLanguage",
        element: <SignLanguageCourse />,
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
  // <StrictMode>
  <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_AUTH_KEY}`}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </GoogleOAuthProvider>

  /* </StrictMode> */
);
