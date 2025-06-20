import React from "react";

const CourseCard = ({ course, onCourseClick, actionText = "Continue Classes" }) => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 group">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-blue-50">
        <img
          src={course?.image?.url || course?.image || "https://via.placeholder.com/400x300"}
          alt={course?.name || course?.title || "Course"}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>

      <div className="p-5">
        {/* Category tag */}
        <span
          className={`${course?.categoryColor || "bg-indigo-50 text-indigo-600"} text-sm px-3 py-1 rounded-full inline-block`}
        >
          {course?.category || course?.tags?.[0] || "General"}
        </span>

        {/* Course title */}
        <h3 className="text-lg font-semibold mt-3 mb-3 text-gray-900 line-clamp-2">
          {course?.name || course?.title || "Untitled Course"}
        </h3>

        {/* Tooltip for description */}
        {actionText !== "Continue Classes" && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-lg w-72 text-center shadow-md z-10">
            {course?.description || "No description available"}
          </div>
        )}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-lg w-72 text-center shadow-md z-10">
          {course?.description || "No description available"}
        </div>


        {/* Instructor info */}
        <div className="flex items-center mb-4">
          <img
            src={"https://miro.medium.com/v2/resize:fit:2400/1*8OkdLpw_7VokmSrzwXLnbg.jpeg"}
            alt={course?.author || course?.instructor?.name || "Instructor"}
            className="w-8 h-8 rounded-full mr-2 border border-gray-200"
          />
          <div className="text-sm">
            <div className="text-gray-500">
              Created by{" "}
              <span className="font-medium text-gray-900">
                {course?.author || course?.instructor?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Course details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <i className="fas fa-book-open"></i>
            <span>
              {course?.lessons || course?.modules?.length || 0}
              {" Lesson" + ((course?.lessons !== 1 && course?.modules?.length !== 1) ? 's' : '')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <i className="far fa-clock"></i>
            <span>{course?.hours || course?.duration || 0}</span>
          </div>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i>
            <span className="font-medium text-gray-900">{course?.rating || "4.5"}</span>
            <span className="text-gray-500 text-sm ml-1">
              ({course?.reviews || Math.floor(Math.random() * 500) + 100} reviews)
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => onCourseClick(course?._id || course?.id)}
          className="w-full bg-indigo-300 text-black py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300 font-medium"
        >
          {actionText || "View Details"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;