import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";

const CourseSection = ({
  title,
  courses = [],
  isLoading = false,
  emptyMessage = "No courses found.",
  actionText,
  onCourseClick
}) => {
  const [activeTab, setActiveTab] = useState("ongoing");
  // Mock tab counts - replace with actual data
  const tabCounts = {
    ongoing: 8,
    completed: 10,
    saved: 12,
    favorite: 25
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      {/* Tabs Navigation */}
      <div className="flex items-center mb-8">
        <div className="flex space-x-4">
          {['ongoing', 'completed', 'saved', 'favorite'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === tab ? "bg-indigo-400 text-white-600" : "text-white-600"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab]})
            </button>
          ))}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <CourseCard
              key={course?._id || course?.id || index}
              course={course}
              onCourseClick={onCourseClick}
              actionText={actionText}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSection;