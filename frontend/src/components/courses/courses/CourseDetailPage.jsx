import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCoursesbyId } from "../../../APIRoutes";
import { studentCourseEnrollment } from "../../../APIRoutes";
import { useToast } from "@chakra-ui/react";

const CourseDetailsPage = () => {
  const toast = useToast();

  const { id } = useParams();
  console.log(id)

  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError("Course ID is missing");
        setLoading(false);
        return;
      }

      try {
        console.log("Making API request to:", `${getCoursesbyId}/${id}`);
        const response = await axios.get(`${getCoursesbyId}/${id}`);
        console.log("API response:", response);
        setCourse(response.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);



  async function handleEnrollStudent() {
    try {
      const res = await axios.post(`${studentCourseEnrollment}/${user._id}`, {
        courseId: id
      });
      if (res.data.success) {
        toast({
          title: "Enrollment successful",
          description: "Processing your enrollment request.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
      else {
        toast({
          title: "Enrollment failed",
          description: "Failed to enroll in the course.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleBuyNow = () => {
    setShowStripeModal(true);
  };

  const closeStripeModal = () => {
    setShowStripeModal(false);
  };

  // Simple toast function (replace with your actual toast implementation)
  const showToast = ({ title, description, status }) => {
    // Replace with your actual toast implementation
    console.log(`${status?.toUpperCase()}: ${title} - ${description}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md mb-6 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded-md mb-4 w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-6 w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded-md w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl text-red-600 mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Use actual course data if available, otherwise use mock data for display purposes
  const displayCourse = course;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Hero Section with Course Image */}
        <div className="relative h-80 bg-blue-50">
          <img
            src={displayCourse?.image.url}
            alt={displayCourse?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white">
              <span className={`${displayCourse?.categoryColor} px-3 py-1 rounded-full text-sm inline-block mb-4`}>
                {displayCourse?.category}
              </span>
              <h1 className="text-3xl font-bold mb-2">{displayCourse?.name}</h1>
              <div className="flex items-center gap-6 mb-2">
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span className="font-medium">{displayCourse?.rating}</span>
                  <span className="ml-1">({displayCourse?.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-book-open mr-1"></i>
                  <span>{displayCourse?.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="far fa-clock mr-1"></i>
                  <span>{displayCourse?.hours}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-signal mr-1"></i>
                  <span>{displayCourse?.level}</span>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src={"https://miro.medium.com/v2/resize:fit:2400/1*8OkdLpw_7VokmSrzwXLnbg.jpeg"}
                  alt={displayCourse?.author}
                  className="w-8 h-8 rounded-full mr-2 border border-white"
                />
                <span>Created by <span className="font-medium">{displayCourse?.author}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of component remains the same but uses displayCourse instead of mockCourse */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Course Details */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {displayCourse?.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayCourse?.learningOutcomes?.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-3">
                  {displayCourse?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium shadow-sm hover:bg-blue-200 transition-colors"
                    >
                      <i className="fas fa-tag text-blue-500 mr-2"></i>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                <div className="space-y-3">
                  {displayCourse?.modules?.map((module, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">
                          <span className="mr-2">{index + 1}.</span>
                          {module?.title}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {module?.lessons} lessons • {module?.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Card */}
            <div className="md:w-80 lg:w-96">
              <div className="sticky top-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-gray-900">${displayCourse?.price}</span>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={handleEnrollStudent}
                    disabled={isEnrolling}
                    className="w-full py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    {isEnrolling ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></span>
                        Enrolling...
                      </span>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center mt-4 mb-6">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <i className="fas fa-infinity text-gray-700 mr-3"></i>
                      <span className="text-gray-700">Full lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-mobile-alt text-gray-700 mr-3"></i>
                      <span className="text-gray-700">Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-certificate text-gray-700 mr-3"></i>
                      <span className="text-gray-700">Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Complete Your Purchase</h3>
              <button onClick={closeStripeModal} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="font-medium mb-1">{displayCourse?.name}</p>
              <p className="text-gray-600 mb-4">Total: ${displayCourse?.price}</p>

              {/* Mock Stripe Form */}
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-sm text-gray-600 mb-1">Card Information</label>
                  <div className="bg-gray-100 h-10 rounded mb-2"></div>
                  <div className="flex gap-2">
                    <div className="bg-gray-100 h-10 rounded flex-1"></div>
                    <div className="bg-gray-100 h-10 rounded flex-1"></div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-sm text-gray-600 mb-1">Name on Card</label>
                  <div className="bg-gray-100 h-10 rounded"></div>
                </div>

                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="block text-sm text-gray-600 mb-1">Billing Address</label>
                  <div className="bg-gray-100 h-10 rounded mb-2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 h-10 rounded"></div>
                    <div className="bg-gray-100 h-10 rounded"></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeStripeModal();
                    handleEnroll({ preventDefault: () => { } });
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Pay ${displayCourse?.price}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By completing your purchase you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;