import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import { 
  FiChevronLeft, 
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiMessageSquare,
  FiUser,
  FiFileText,
  FiPlusCircle
} from "react-icons/fi";

export const Example = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
    <Sidebar />
    <div className="flex-1 p-1">
      {/* Your page content here */}
    </div>
  </div>
);

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Modern color scheme
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgColor = isDark ? 'hover:bg-gray-800' : 'hover:bg-indigo-50';
  const selectedBgColor = isDark ? 'bg-indigo-900' : 'bg-indigo-100';
  const selectedTextColor = 'text-indigo-600';
  
  return (
    <motion.div
      layout
      className={`sticky top-0 h-screen shrink-0 ${borderColor} ${bgColor} shadow-lg ${textColor} z-10`}
      style={{
        width: open ? "240px" : "80px",
        transition: "width 0.3s ease",
        borderTopRightRadius: "24px",
        borderBottomRightRadius: "24px",
      }}
    >
      <div className="flex flex-col h-full">
        <Logo open={open} isDark={isDark} />
        
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <SidebarLink 
            to={`${user.role === "Student" ? "/home" : "/home/teacher"}`} 
            title="Dashboard" 
            Icon={FiHome} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
          <SidebarLink 
            to={user.role === "Student" ? "/home" : "/home/teacher-add-course"} 
            title={user.role === "Student" ? "Assignments" : "Add Courses"} 
            Icon={user.role === "Student" ? FiFileText : FiPlusCircle} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
          {user.role === "Student" && (
            <SidebarLink 
              to="/home/mycourses" 
              title="My Courses" 
              Icon={FiBookOpen} 
              selected={selected} 
              setSelected={setSelected} 
              open={open}
              isDark={isDark}
              hoverBgColor={hoverBgColor}
              selectedBgColor={selectedBgColor}
              selectedTextColor={selectedTextColor}
            />
          )}
          <SidebarLink 
            to="/home/calendar" 
            title="Calendar" 
            Icon={FiCalendar} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
          <SidebarLink 
            to="/home/blog" 
            title="Blog" 
            Icon={FiFileText} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
          <SidebarLink 
            to="/home/chat" 
            title="Chatbot" 
            Icon={FiMessageSquare} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
          <SidebarLink 
            to={`${user.role === "Student" ? "profile" : "teacherProfile"}`} 
            title="Profile" 
            Icon={FiUser} 
            selected={selected} 
            setSelected={setSelected} 
            open={open}
            isDark={isDark}
            hoverBgColor={hoverBgColor}
            selectedBgColor={selectedBgColor}
            selectedTextColor={selectedTextColor}
          />
        </div>
        
        <div className="p-4">
          <ToggleButton 
            open={open} 
            setOpen={setOpen} 
            isDark={isDark}
            hoverBgColor={hoverBgColor}
          />
        </div>
      </div>
    </motion.div>
  );
};

const SidebarLink = ({ 
  to, 
  title, 
  Icon, 
  selected, 
  setSelected, 
  open, 
  notifs,
  isDark,
  hoverBgColor,
  selectedBgColor,
  selectedTextColor
}) => {
  const isActive = selected === title;
  
  return (
    <Link to={to}>
      <div
        onClick={() => setSelected(title)}
        className={`
          flex items-center gap-3 px-3 py-3 my-1 rounded-xl transition-all duration-200 
          ${isActive ? selectedBgColor : ''} 
          ${isActive ? selectedTextColor : 'text-gray-500'} 
          ${hoverBgColor}
          group cursor-pointer
        `}
      >
        <div className={`text-xl ${isActive ? selectedTextColor : ''}`}>
          <Icon />
        </div>
        
        {open && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`font-medium whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}
          >
            {title}
          </motion.span>
        )}
        
        {notifs && open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto bg-indigo-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5"
          >
            {notifs}
          </motion.div>
        )}
      </div>
    </Link>
  );
};

const Logo = ({ open, isDark }) => (
  <div className="p-4 flex items-center">
    <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 p-2 shadow-md">
      <svg width="24" height="24" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" fill="white" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" fill="white" />
      </svg>
    </div>
    
    {open && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="ml-3"
      >
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          EduSync
        </div>
      </motion.div>
    )}
  </div>
);

const ToggleButton = ({ open, setOpen, isDark, hoverBgColor }) => (
  <button
    onClick={() => setOpen(!open)}
    className={`
      w-full rounded-xl p-2 flex items-center justify-center
      ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
      ${hoverBgColor}
      transition-all duration-200
    `}
  >
    <motion.div
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <FiChevronLeft className="text-indigo-600" size={20} />
    </motion.div>
    
    {open && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="ml-2 text-indigo-600 font-medium"
      >
        Collapse
      </motion.span>
    )}
  </button>
);