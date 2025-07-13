import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../APIRoutes";
import CourseSection from "../../components/courses/courses/CourseSection";
import RecommendedCourses from "../../components/courses/courses/RecommendCourses";

const AllCoursePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${getAllCourses}/${user._id}`,
          { withCredentials: true }
        );
        console.log("Fetched courses:", response.data);

        if (response?.data?.success) {
          setEnrolledCourses(response.data.courses || []);
          localStorage.setItem(
            user?.role === 'Student' ? "student-courses" : 'teacher-courses',
            JSON.stringify(response.data.courses)
          );
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user?.role]);

  const openCourse = (courseId) => {
    navigate(`/home/course-details/${courseId}`);
  };
  const openCourseDetail = (courseId) => {
    navigate(`/home/mycourses/${courseId}`);
  };


  // Filter courses based on active tab (this should be implemented with real data)
  const getFilteredCourses = () => {
    // In a real implementation, you would filter based on course status
    return enrolledCourses;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">

        {/* Enrolled Courses Section */}
        <CourseSection
          title="Your Courses"
          courses={getFilteredCourses()}
          isLoading={isLoading}
          emptyMessage="You haven't enrolled in any courses yet. Browse the recommended courses above to get started."
          actionText="Continue Classes"
          onCourseClick={openCourse}
        />

        {/* Recommended Courses Section */}
        <RecommendedCourses onCourseClick={openCourseDetail} />
      </div>
    </div>
  );
};

export default AllCoursePage;