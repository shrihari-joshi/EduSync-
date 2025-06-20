import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { studentCourseEnrollment } from "../APIRoutes";

const CourseCards = ({
  name,
  description,
  studentId,
  students = [],
  id,
  background
}) => {
  return (
    <section className="px-4 py-8">
      <motion.div
        className="carousel-container"
        style={{ display: "flex", overflow: "hidden" }}
        whileTap={{ cursor: "grabbing" }}
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.1}
      >
        <CourseCard
          name={name}
          description={description}
          studentId={studentId}
          students={students}
          courseId={id}
          background={background}
        />
        {/* Add more cards as needed */}
      </motion.div>
    </section>
  );
};

const CourseCard = ({
  name,
  description,
  studentId,
  students = [],
  courseId,
  background = ''
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEnrolled, setIsEnrolled] = useState(students.includes(studentId));
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [formData, setFormData] = useState({ key: "" });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(isEnrolled);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ key: e.target.value });
  };

  const clickHandler = () => {
    if (enrollmentSuccess || user.role.toLowerCase() === "teacher") {
      navigate(`/home/course-details/${courseId}`);
    } else {
      setIsOpen(true);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${studentCourseEnrollment}/${user._id}`, {
        courseId: courseId,
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            title: "Enrollment Success",
            description: "You have successfully enrolled.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setEnrollmentSuccess(true);
          setIsOpen(false);
        }
      })
      .catch((error) => {
        toast({
          title: "Enrollment Error",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative h-96 w-80 shrink-0 overflow-hidden rounded-lg shadow-lg"
        style={{ marginRight: '20px', backgroundColor: '#818cf8' }} // Indigo-700
      >
        {background && (
          <div
            className="absolute inset-0 opacity-75"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/70 to-indigo-700/30 z-0"></div>

        <div className="relative z-10 p-6 h-full flex flex-col text-white">
          <div className="mb-auto">
            <span className="mb-3 inline-block rounded-full bg-indigo-200 bg-opacity-20 px-3 py-1 text-xs font-medium text-indigo-100 backdrop-blur-sm">
              Course
            </span>

            <motion.h2
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
              className="mt-3 font-bold text-2xl text-white"
            >
              {name}
            </motion.h2>

            <p className="mt-2 text-indigo-100 line-clamp-4 text-sm">
              {description}
            </p>
          </div>

          <motion.button
            whileHover={{
              backgroundColor: "#6366f1",
              color: "white",
              scale: 1.02,
              boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full rounded-md bg-white py-2 text-center font-medium text-indigo-800 transition-all duration-300"
            onClick={clickHandler}
          >
            {(user.role.toLowerCase() === "teacher" || enrollmentSuccess)
              ? "Open Course"
              : "Enroll Now"}
          </motion.button>
        </div>
      </motion.div>

      {/* Enrollment Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="indigo.800">
              Enroll in Course
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl id="key" mb={4}>
                <FormLabel color="indigo.700">Enrollment Key</FormLabel>
                <Input
                  type="text"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  focusBorderColor="indigo.200"
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="outline" colorScheme="indigo">
                Cancel
              </Button>
              <Button
                colorScheme="indigo"
                onClick={handleEnroll}
                ml={3}
                isLoading={isLoading}
              >
                Enroll
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CourseCards;