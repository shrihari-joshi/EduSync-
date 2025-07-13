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


  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-700">{title}</h2>

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