import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllCourses } from "../../../APIRoutes";
import CourseCard from "./CourseCard"; // Use the shared CourseCard component
import { getCourseRecommendation } from "../../../APIRoutes";

const RecommendedCourses = ({ onCourseClick }) => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const user = JSON.parse(localStorage.getItem("user"));
  const branch = user?.branch;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const response = await axios.post(`${getCourseRecommendation}`, {
        //    userId: user._id,
        //  withCredentials: true,
        //  });
        const response = await axios.get(
          `${getAllCourses}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const userId = user?._id; // Assuming user object has _id
          const filteredCourses = response.data.courses.filter(
            (course) => !course.students.includes(userId)
          );
          setCourses(filteredCourses);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recommended For You</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="fas fa-th-large text-gray-600"></i>
            <span className="text-gray-700">Category</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              <span className="text-gray-700">Popular</span>
              <i className="fas fa-chevron-down text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {currentCourses && currentCourses.map((course) => (
          <CourseCard
            key={course._id || course.id}
            course={course}
            onCourseClick={onCourseClick}
            actionText="View Details"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-indigo-200 cursor-pointer shadow-sm'
              }`}
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Previous
          </button>
          <div className="flex items-center gap-2 mx-4">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg transition-colors ${currentPage === index + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-indigo-200'
                  } cursor-pointer shadow-sm`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-indigo-200 cursor-pointer shadow-sm'
              }`}
          >
            Next
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendedCourses;