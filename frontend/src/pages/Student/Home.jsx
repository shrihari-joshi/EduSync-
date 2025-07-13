import React, { useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import Example from "../../components/Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Use the useNavigate hook for programmatic navigation

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role.toLowerCase() === "teacher") {
        navigate("/home/teacher");
      } else {
        navigate('/home')
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <div className="sticky top-0 h-screen shrink-0">
        <Example />
      </div>
      <div className="flex-row w-full overflow-y-auto">
        <Navbar />
        <Outlet />
      </div>

    </div>
  );
};

export default Home;
