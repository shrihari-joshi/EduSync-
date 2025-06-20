import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Textarea,
  useToast,
  Text,
  Circle,
  HStack,
  Image,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Link,
  Icon,
  Badge,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { TimeIcon, AttachmentIcon, CheckIcon, InfoIcon, StarIcon, DownloadIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  generateRoadmap,
  getAssignments,
  gradeAssignment,
  submitAssignment,
} from "../../APIRoutes/index.js";
import { host } from "../../APIRoutes/index.js";
import BarGraph from "../../components/bargraph.jsx";
import Roadmap from "../../components/roadmap.jsx";

// Header component for course details
const CourseHeader = ({ course, handleEnrollStudent }) => {
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Card shadow="md" variant="outline" borderColor="indigo.100">
      <CardHeader bg="indigo.50" borderBottomWidth="1px" borderColor="indigo.100">
        <Heading size="lg" color="indigo.700">{course?.name}</Heading>
      </CardHeader>
      {course?.image?.url && (
        <Image
          src={course.image.url}
          alt={`${course.name} image`}
          objectFit="cover"
          maxH="250px"
          width="100%"
        />
      )}
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Text fontSize="md" color="gray.700">{truncateText(course?.description, 400)}</Text>
          
          {!course && (
            <Button
              colorScheme="indigo"
              size="lg"
              width="fit-content"
              onClick={handleEnrollStudent}
              mt={4}
            >
              Enroll Now
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Action buttons component
const CourseActions = ({ user, courseId, handleGenerateQuiz, handleGenerateRoadmap, roadmaps, roadmap, redirect }) => {
  return (
    <Card shadow="sm" mt={4}>
      <CardBody>
        <Flex gap={4} flexWrap="wrap" justifyContent="flex-start">
          {courseId === "67ddd57dbb38704921a5a142" && (
            <Button
              bg="indigo.600"
              color="white"
              _hover={{ bg: "indigo.700" }}
              variant="solid"
              onClick={() => redirect(courseId)}
              leftIcon={<Icon as={StarIcon} />}
            >
              Sign Language Labs
            </Button>
          )}

          {user.role === "Teacher" && (
            <Button
              bg="indigo.300"
              _hover={{ bg: "indigo.400" }}
              variant="outline"
              onClick={() => handleGenerateQuiz()}
              leftIcon={<Icon as={InfoIcon} />}
            >
              AI Generate Quiz
            </Button>
          )}

          {user.role === "Teacher" &&
            roadmaps &&
            roadmaps.length === 0 &&
            roadmap.length === 0 && (
              <Button
                bg="indigo.300"
                _hover={{ bg: "indigo.400" }}
                variant="outline"
                onClick={() => handleGenerateRoadmap()}
                leftIcon={<Icon as={InfoIcon} />}
              >
                AI Generate Roadmap
              </Button>
            )}
        </Flex>
      </CardBody>
    </Card>
  );
};

// Roadmap component wrapper
const CourseRoadmap = ({ roadmap, user }) => {
  return (
    <Card shadow="md" variant="outline" borderColor="indigo.100">
      <CardHeader bg="indigo.50" borderBottomWidth="1px" borderColor="indigo.100">
        <Heading size="md" color="indigo.600">Course Roadmap</Heading>
      </CardHeader>
      <CardBody>
        <Roadmap roadmap={roadmap} user={user} />
      </CardBody>
    </Card>
  );
};

// Grade Button component
const GradeButton = ({ item, grades, handleGrade, onOpen }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateGrade = async (id) => {
    setIsLoading(true);
    await handleGrade(id);
    setIsLoading(false);
  };

  return (
    <>
      {grades[item._id] === undefined ? (
        <Button
          bg="indigo.300"
          _hover={{ bg: "indigo.400" }}
          onClick={() => handleCalculateGrade(item._id)}
          width="48%"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="md" color="white" />
          ) : (
            "Calculate Grade"
          )}
        </Button>
      ) : (
        <Button
          bg="indigo.300"
          _hover={{ bg: "indigo.400" }}
          width="48%"
          size="lg"
          onClick={onOpen}
        >
          See Grade
        </Button>
      )}
    </>
  );
};

// Assignment Card component
const AssignmentCard = ({ item, index, user, handleFileChange, handleFileUpload, hasSubmitted, file, grades, handleGrade, isOpen, onOpen, onClose }) => {
  return (
    <Card
      key={item._id}
      display="flex"
      flexDirection="column"
      width="100%"
      shadow="md"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ borderColor: "indigo.300" }}
      transition="all 0.3s"
    >
      <CardBody display="flex" flexDirection="column" flexGrow={1}>
        <VStack align="start" mb={4}>
          <HStack mb={2}>
            <Icon as={TimeIcon} color="red.500" />
            <Heading size="md">{item.description}</Heading>
          </HStack>
          <HStack className="flex flex-wrap" spacing={2} mb={2}>
            {item.criteria.map((c, idx) => (
              <Badge colorScheme="indigo" key={idx}>
                {c}
              </Badge>
            ))}
          </HStack>
          <Text fontWeight="semibold" mb={4} color="red.500">
            Deadline: {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </VStack>

        {user.role === "Student" && (
          <VStack spacing={4} align="stretch">
            <Button
              as="label"
              htmlFor={`file-input-${index}`}
              colorScheme={hasSubmitted[item._id] ? "green" : "indigo"}
              width="100%"
              size="lg"
              cursor="pointer"
              leftIcon={
                hasSubmitted[item._id] ? (
                  <CheckIcon />
                ) : (
                  <AttachmentIcon />
                )
              }
              isDisabled={hasSubmitted[item._id]}
            >
              {hasSubmitted[item._id]
                ? "Uploaded"
                : "Upload Assignment"}
              <Input
                id={`file-input-${index}`}
                type="file"
                display="none"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>

            <HStack spacing={4} width="100%" justify="space-between">
              {!hasSubmitted[item._id] && (
                <Button
                  colorScheme="teal"
                  onClick={() => handleFileUpload(item._id)}
                  isDisabled={!file}
                  width="48%"
                  size="lg"
                >
                  Submit
                </Button>
              )}
              <GradeButton
                item={item}
                grades={grades}
                handleGrade={handleGrade}
                onOpen={onOpen}
              />
            </HStack>
          </VStack>
        )}

        {grades[item._id] && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxWidth="80%">
              <ModalHeader bg="indigo.50">Your Grade</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="indigo.500"
                  mb={4}
                >
                  Score: {grades[item._id].grade}/10
                </Text>

                {Object.entries(grades[item._id])
                  .filter(([key]) => key !== "grade")
                  .map(([criteria, feedback]) => (
                    <Box key={criteria} mb={4} p={3} borderLeft="4px" borderColor="indigo.300" bg="gray.50">
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="gray.700"
                      >
                        {criteria}
                      </Text>
                      <Text color="gray.600" fontSize="md">
                        {feedback}
                      </Text>
                    </Box>
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="indigo" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </CardBody>
    </Card>
  );
};

// Assignment Form component
const AssignmentForm = ({ newAssignment, handleInputChange, handleCriteriaChange, handleCreateAssignment, setShowAssignmentForm }) => {
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" mb={6} mt={8} bg="white" shadow="md">
      <Heading as="h3" size="lg" mb={6} color="indigo.600">
        Create New Assignment
      </Heading>

      <FormControl mb={4}>
        <FormLabel>Deadline</FormLabel>
        <Input
          type="date"
          name="deadline"
          value={newAssignment.deadline}
          onChange={handleInputChange}
          focusBorderColor="indigo.400"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={newAssignment.description}
          onChange={handleInputChange}
          focusBorderColor="indigo.400"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Criteria 1</FormLabel>
        <Input
          value={newAssignment.criteria[0]}
          onChange={(e) => handleCriteriaChange(0, e.target.value)}
          focusBorderColor="indigo.400"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Criteria 2</FormLabel>
        <Input
          value={newAssignment.criteria[1]}
          onChange={(e) => handleCriteriaChange(1, e.target.value)}
          focusBorderColor="indigo.400"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Criteria 3</FormLabel>
        <Input
          value={newAssignment.criteria[2]}
          onChange={(e) => handleCriteriaChange(2, e.target.value)}
          focusBorderColor="indigo.400"
        />
      </FormControl>

      <HStack spacing={4}>
        <Button
          bg="indigo.600"
          color="white"
          _hover={{ bg: "indigo.700" }}
          onClick={handleCreateAssignment}
        >
          Submit Assignment
        </Button>
        <Button
          bg="gray.200"
          _hover={{ bg: "gray.300" }}
          onClick={() => {
            setShowAssignmentForm(false);
          }}
        >
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};

// Leaderboard component
const Leaderboard = ({ studentMarks }) => {
  return (
    <Card shadow="md" variant="outline" borderColor="indigo.100">
      <CardHeader bg="indigo.50" borderBottomWidth="1px" borderColor="indigo.100">
        <Heading size="md" color="indigo.600">Leaderboard</Heading>
        <Text>Top performers in this course</Text>
      </CardHeader>
      <CardBody>
        <BarGraph studentMarks={studentMarks} />
      </CardBody>
    </Card>
  );
};

// Related Courses component
const RelatedCourses = ({ relatedCourses, isLoadingRelated }) => {
  return (
    <Card shadow="md" variant="outline" borderColor="indigo.100">
      <CardHeader bg="indigo.50" borderBottomWidth="1px" borderColor="indigo.100">
        <Heading size="md" color="indigo.600">Related Courses</Heading>
        <Text>Explore similar courses from around the web</Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {isLoadingRelated ? (
            <Flex justify="center" p={8}>
              <Spinner size="xl" color="indigo.500" />
            </Flex>
          ) : (
            <Flex gap={4} flexWrap="wrap" justifyContent="flex-start">
              {relatedCourses.map((course, index) => (
                <Card
                  key={index}
                  maxW="sm"
                  overflow="hidden"
                  flex="0 0 300px"
                  shadow="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ 
                    transform: "translateY(-5px)", 
                    shadow: "lg",
                    borderColor: "indigo.300"
                  }}
                  transition="all 0.3s ease"
                >
                  <Image
                    src={course.thumbnail || "/api/placeholder/300/200"}
                    alt={course.title}
                    objectFit="cover"
                    height="150px"
                  />
                  <CardBody>
                    <Heading size="sm" mb={2}>{course.title}</Heading>
                    <Text fontSize="sm" color="gray.600" mb={3}>{course.platform}</Text>
                    <Button
                      as={Link}
                      href={course.url}
                      isExternal
                      bg="indigo.500"
                      color="white"
                      _hover={{ bg: "indigo.600" }}
                      size="sm"
                      width="100%"
                    >
                      View Course
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Main component
export default function CourseDetail() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const courses = JSON.parse(
    localStorage.getItem(
      user.role === "Student" ? "student-courses" : "teacher-courses"
    )
  );

  const toast = useToast();
  const navigate = useNavigate();
  const selectedCourse = courses.find((course) => course._id === id);
  const roadmap = selectedCourse?.modules ? selectedCourse.modules : [];
  
  // State variables
  const [roadmaps, setRoadmaps] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState({});
  const [studentMarks, setStudentMarks] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    deadline: "",
    course: id,
    description: "",
    criteria: ["", "", ""],
  });
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    // Fetch assignments
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${getAssignments}`, {
          headers: {
            course: `${id}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setAssignments(response.data.assignments);
        }
      } catch (error) {
        console.log("Error fetching assignments:", error);
      }
    };

    // Fetch leaderboard
    const handleLeaderBoard = async () => {
      try {
        const response = await axios.get(`${host}/course/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setStudentMarks(response.data.leaderboard);
      } catch (error) {
        console.log("Error fetching leaderboard:", error);
      }
    };

    // Fetch related courses
    const fetchRelatedCourses = async () => {
      setIsLoadingRelated(true);
      try {
        const response = await axios.get(`${host}/course/related/${id}`, {
          withCredentials: true,
        });
        
        if (response.data.success) {
          setRelatedCourses(response.data.relatedCourses);
        } else {
          // Fallback data
          setRelatedCourses([
            {
              title: "Introduction to American Sign Language",
              platform: "Udemy",
              thumbnail: "https://img-c.udemycdn.com/course/240x135/2572908_5e5f_2.jpg",
              url: "https://www.udemy.com/course/introduction-to-american-sign-language/"
            },
            {
              title: "Sign Language 101: Learn to Sign",
              platform: "Coursera",
              thumbnail: "https://img-c.udemycdn.com/course/240x135/1376134_4b51_10.jpg",
              url: "https://www.coursera.org/learn/sign-language"
            },
            {
              title: "ASL for Beginners",
              platform: "edX",
              thumbnail: "https://img-c.udemycdn.com/course/240x135/3636920_ab0c_2.jpg",
              url: "https://www.edx.org/learn/sign-language"
            }
          ]);
        }
      } catch (error) {
        console.log("Error fetching related courses:", error);
        // Fallback data
        setRelatedCourses([
          {
            title: "Introduction to American Sign Language",
            platform: "Udemy",
            thumbnail: "https://img-c.udemycdn.com/course/240x135/2572908_5e5f_2.jpg",
            url: "https://www.udemy.com/course/introduction-to-american-sign-language/"
          },
          {
            title: "Sign Language 101: Learn to Sign",
            platform: "Coursera",
            thumbnail: "https://img-c.udemycdn.com/course/240x135/1376134_4b51_10.jpg",
            url: "https://www.coursera.org/learn/sign-language"
          },
          {
            title: "ASL for Beginners",
            platform: "edX",
            thumbnail: "https://img-c.udemycdn.com/course/240x135/3636920_ab0c_2.jpg",
            url: "https://www.edx.org/learn/sign-language"
          }
        ]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedCourses();
    fetchAssignments();
    handleLeaderBoard();
  }, [id]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCriteriaChange = (index, value) => {
    const updatedCriteria = [...newAssignment.criteria];
    updatedCriteria[index] = value;
    setNewAssignment((prev) => ({
      ...prev,
      criteria: updatedCriteria,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Action handlers
  const handleFileUpload = async (assignmentId) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("submissionFile", file);
    formData.append("assignmentId", assignmentId);

    try {
      const response = await axios.post(
        `${submitAssignment}/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "File uploaded",
          description: "Your assignment was uploaded successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setFile(null);
        setHasSubmitted((prev) => ({ ...prev, [assignmentId]: true }));
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const redirect = () => {
    window.location.href = "http://localhost:5174/";
  };

  const handleGrade = async (aid) => {
    try {
      const response = await axios.get(`${gradeAssignment}`, {
        headers: {
          studentId: `${user._id}`,
          assignmentId: `${aid}`,
        },
      });
      if (response.data.success) {
        setGrades((prev) => ({
          ...prev,
          [aid]: response.data.evaluation,
        }));
      }
    } catch (error) {
      console.log("Error fetching grade:", error);
      toast({
        title: "Error",
        description: "Failed to fetch grade.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      const response = await axios.get(`${generateRoadmap}/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Roadmap generated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setRoadmaps(response.data.roadmap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateAssignment = async () => {
    // Validate form inputs
    const { deadline, course, description, criteria } = newAssignment;
    if (!deadline || !course || !description || criteria.some((c) => !c)) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const assignmentData = {
      deadline,
      course,
      description,
      criteria,
    };

    try {
      const response = await axios.post(
        `${host}/teacher/assignment`,
        assignmentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast({
          title: "Assignment Created",
          description: "Your assignment has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowAssignmentForm(false);
        setNewAssignment({
          deadline: "",
          course: id,
          description: "",
          criteria: ["", "", ""],
        });
        // Refresh assignments
        const fetchAssignments = async () => {
          try {
            const response = await axios.get(`${getAssignments}`, {
              headers: {
                course: `${id}`,
              },
              withCredentials: true,
            });
            if (response.data.success) {
              setAssignments(response.data.assignments);
            }
          } catch (error) {
            console.log("Error fetching assignments:", error);
          }
        };
        fetchAssignments();
      } else {
        toast({
          title: "Failed to Create Assignment",
          description: response.data.message || "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "There was an error creating the assignment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  async function handleEnrollStudent() {
    try {
      const res = await axios.post(`${host}/student/course/${user._id}`, {
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
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // If no course is selected
  if (!selectedCourse) {
    return (
      <Container maxW="container.xl" py={8}>
        <Card shadow="md" variant="outline" borderColor="indigo.100">
          <CardHeader bg="indigo.50" borderBottomWidth="1px" borderColor="indigo.100">
            <Heading size="lg" color="indigo.700">Course Details</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text>This course is not currently selected or you haven't enrolled yet.</Text>
              <Text>Enroll in this course to access all materials and assignments.</Text>
              <Button
                colorScheme="indigo"
                size="lg"
                width="fit-content"
                onClick={handleEnrollStudent}
              >
                Enroll Now
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Course Header */}
        <CourseHeader course={selectedCourse} handleEnrollStudent={handleEnrollStudent} />
        
        {/* Course Actions */}
        <CourseActions
          user={user}
          courseId={id}
          handleGenerateQuiz={() => {}}
          handleGenerateRoadmap={handleGenerateRoadmap}
          roadmaps={roadmaps}
          roadmap={roadmap}
          redirect={redirect}
        />
        
        {/* Course Roadmap */}
        <CourseRoadmap roadmap={roadmap} user={user} />
        
        {/* Assignments Section */}
        {assignments.length > 0 && (
          <>
            <Box pt={8}>
              <Heading as="h2" size="xl" mb={6} color="indigo.600" borderBottom="3px solid" borderColor="indigo.300" pb={2}>
                Assignments
              </Heading>
            </Box>
            
            <VStack spacing={6} align="stretch">
              {assignments.map((item, index) => (
                <AssignmentCard
                  key={item._id}
                  item={item}
                  index={index}
                  user={user}
                  handleFileChange={handleFileChange}
                  handleFileUpload={handleFileUpload}
                  hasSubmitted={hasSubmitted}
                  file={file}
                  grades={grades}
                  handleGrade={handleGrade}
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={onClose}
                />
              ))}
            </VStack>
          </>
        )}
        
        {/* Create Assignment (Teacher Only) */}
        {user.role === "Teacher" && (
          <>
            {showAssignmentForm ? (
              <AssignmentForm
                newAssignment={newAssignment}
                handleInputChange={handleInputChange}
                handleCriteriaChange={handleCriteriaChange}
                handleCreateAssignment={handleCreateAssignment}
                setShowAssignmentForm={setShowAssignmentForm}
              />
            ) : (
              <Button
                mt={4}
                bg="indigo.300"
                _hover={{ bg: "indigo.400" }}
                onClick={() => setShowAssignmentForm(true)}
                leftIcon={<Icon as={DownloadIcon} />}
              >
                Create Assignment
              </Button>
            )}
          </>
        )}
        
        {/* Leaderboard */}
        <Leaderboard studentMarks={studentMarks} />
        
        {/* Related Courses */}
        <RelatedCourses
          relatedCourses={relatedCourses}
          isLoadingRelated={isLoadingRelated}
        />
      </VStack>