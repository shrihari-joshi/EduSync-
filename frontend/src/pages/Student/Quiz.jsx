import axios from "axios";
import React, { useEffect, useState } from "react";
import { quizRoute, submitQuiz } from "../../APIRoutes/index.js";
import { useNavigate, useParams } from "react-router-dom";
import { Button, useToast } from "@chakra-ui/react";
import {
  Center,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [passingScore, setPassingScore] = useState(70); // Default passing score
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const { id, idx } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${quizRoute}/${id}/${idx}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setQuizData(response.data.quiz.questions);
          setPassingScore(response.data.quiz.passingScore || 70);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load quiz data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchQuiz();
  }, [id, idx, toast]);

  const handleOptionClick = (option) => {
    if (user.role === "Teacher") {
      return;
    }
    setSelectedOption(option);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = {
      ...quizData[currentQuestion],
      user_answer: option,
    };
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(userAnswers[currentQuestion + 1]?.user_answer || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(userAnswers[currentQuestion - 1]?.user_answer || null);
    }
  };

  const calculateMarks = () => {
    let marks = 0;
    userAnswers.forEach((answer, index) => {
      if (answer.user_answer === quizData[index].answer) {
        marks += 2; // Increment marks for correct answers
      }
    });
    return marks;
  };

  const handleSubmit = async () => {
    const marks = calculateMarks();
    setScore(marks); // Update score state

    // Check if all questions have been answered
    if (userAnswers.length < quizData.length) {
      toast({
        title: "Warning",
        description: "Please answer all questions before submitting",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const submissionData = {
      course: `${id}`,
      module: `${idx}`,
      student: user._id,
      marks,
      questions: userAnswers.map((answer) => ({
        question: answer.question,
        options: answer.options,
        answer: answer.answer,
        user_answer: answer.user_answer,
        // Keep these fields for your own tracking
        conceptTags: answer.conceptTags || [],
        difficulty: answer.difficulty || 1,
        correct: answer.user_answer === answer.answer,
      })),
      passingScore: passingScore,
      passed: (marks / (quizData.length * 2)) * 100 >= passingScore,
    };

    try {
      const response = await axios.post(`${submitQuiz}`, submissionData, {
        withCredentials: true,
      });
      if (response.data.success) {
        setFeedback(response.data.evaluation?.evaluation || []);
        setShowReview(true); // Show the review after submission
        toast({
          title: "Success",
          description: "Quiz submitted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0); // Reset to the first question
    setUserAnswers([]); // Clear user's answers
    setSelectedOption(null); // Clear selected option
    setShowReview(false); // Hide the review and show the quiz again
    setFeedback([]); // Clear feedback
    setScore(0); // Reset score
  };

  const navigate = useNavigate();

  if (loading) {
    return (
      <Center h="100vh">
        <Box
          maxW="md"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
        >
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="auto"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Loading Quiz
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please wait while we load the quiz questions.
            </AlertDescription>
          </Alert>
        </Box>
      </Center>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <Center h="100vh">
        <Box
          maxW="md"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
        >
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="auto"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No Quiz Available
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              There are no questions available for this quiz at the moment.
            </AlertDescription>
          </Alert>
          <Center mt={6}>
            <Button
              className="!bg-indigo-600"
              onClick={() => navigate(`/home/course-details/${id}`)}
            >
              Return to Course
            </Button>
          </Center>
        </Box>
      </Center>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[80%] bg-white rounded-lg shadow-lg p-6">
        {showReview ? (
          <>
            {/* Quiz Review Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quiz Review
            </h2>

            {/* Display the score */}
            <div
              className={`mb-6 p-4 ${(score / (quizData.length * 2)) * 100 >= passingScore
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
                } border rounded-lg`}
            >
              <h3 className="text-xl font-semibold">
                Your Score: {score}/{quizData.length * 2} (
                {((score / (quizData.length * 2)) * 100).toFixed(1)}%)
              </h3>
              <p className="mt-2">
                {(score / (quizData.length * 2)) * 100 >= passingScore
                  ? `Congratulations! You've passed the quiz. Passing score: ${passingScore}%`
                  : `You didn't meet the passing score of ${passingScore}%. You might want to review the material and try again.`}
              </p>
            </div>

            {/* Show concept mastery if available */}
            {userAnswers.some(
              (answer) => answer.conceptTags && answer.conceptTags.length > 0
            ) && (
                <div className="mb-6 p-4 bg-indigo-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Concept Mastery</h3>
                  {/* This is a placeholder for concept mastery analysis */}
                  <p>
                    A detailed breakdown of your performance by concept would
                    appear here.
                  </p>
                </div>
              )}

            {quizData.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect =
                userAnswer && userAnswer.user_answer === question.answer;

              return (
                <div
                  key={index}
                  className={`mb-6 p-4 border rounded-lg ${isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                    }`}
                >
                  <h3 className="text-lg font-semibold">
                    Q{index + 1}. {question.question}
                  </h3>

                  {question.conceptTags && question.conceptTags.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1 mb-2">
                      Concepts: {question.conceptTags.join(", ")}
                    </div>
                  )}

                  {question.difficulty && (
                    <div className="text-sm text-gray-600 mb-2">
                      Difficulty: {question.difficulty}/5
                    </div>
                  )}

                  <div className="mt-2">
                    <strong>Your Answer:</strong>{" "}
                    {userAnswer
                      ? question.options[userAnswer.user_answer]
                      : "Not answered"}
                  </div>

                  <div
                    className={`mt-1 ${isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                  >
                    <strong>Correct Answer:</strong>{" "}
                    {question.options[question.answer]}
                  </div>

                  {feedback && feedback[index] && (
                    <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-100 rounded">
                      <strong>Feedback:</strong> {feedback[index].feedback}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Buttons for after quiz review */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
                onClick={retakeQuiz}
              >
                Retake Quiz
              </button>

              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-gray-600"
                onClick={() => navigate(`/home/course-details/${id}`)}
              >
                Return to Course
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Quiz Progress Indicator */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${(currentQuestion / (quizData.length - 1)) * 100
                      }%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-right mt-1 text-gray-600">
                Question {currentQuestion + 1} of {quizData.length}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {`Q${currentQuestion + 1}. ${quizData[currentQuestion].question
                  }`}
              </h2>

              {/* Display concept tags for teachers */}
              {user.role === "Teacher" &&
                quizData[currentQuestion].conceptTags && (
                  <p className="text-sm text-gray-600 mb-2">
                    Concepts: {quizData[currentQuestion].conceptTags.join(", ")}
                  </p>
                )}

              {/* Display difficulty for teachers */}
              {user.role === "Teacher" &&
                quizData[currentQuestion].difficulty && (
                  <p className="text-sm text-gray-600 mb-2">
                    Difficulty: {quizData[currentQuestion].difficulty}/5
                  </p>
                )}
            </div>

            <div className="space-y-4">
              {Object.entries(quizData[currentQuestion].options).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg transition-colors ${user.role === "Student" ? "cursor-pointer" : ""
                      } ${user.role === "Teacher" &&
                        quizData[currentQuestion].answer === key
                        ? "bg-green-400 text-black"
                        : ""
                      } ${selectedOption === key
                        ? "bg-blue-500 text-white"
                        : `bg-gray-200 ${user.role === "Student"
                          ? "hover:bg-gray-300"
                          : "cursor-default"
                        }`
                      }`}
                    onClick={() => handleOptionClick(key)}
                  >
                    <span className="font-semibold">{key.toUpperCase()}: </span>
                    {value}
                  </div>
                )
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ${currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>

              {currentQuestion === quizData.length - 1 ? (
                user.role === "Student" ? (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleSubmit}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => {
                      navigate(`/home/course-details/${id}`);
                    }}
                  >
                    Return to Course
                  </button>
                )
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
