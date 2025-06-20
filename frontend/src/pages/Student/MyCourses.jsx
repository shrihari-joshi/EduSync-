import React, { useEffect, useRef, useState } from 'react';
import { SquishyCard } from '../../components/index.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useColorMode } from "@chakra-ui/react";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";

    const user = JSON.parse(localStorage.getItem('user'));
    const id = user._id;

    // Set courses from localStorage or fetch from API
    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem(user.role === 'Student' ? 'student-courses' : 'teacher-courses')) || [];
        console.log(storedCourses)
        setCourses(storedCourses);

        // Filter enrolled courses
        const filteredEnrolledCourses = storedCourses.filter(course => course.students.includes(id));
        setEnrolledCourses(filteredEnrolledCourses);
    }, []);

    return (
        <div className={`${isDark ? "bg-black text-white" : "bg-white text-black"}`}>

            {
                enrolledCourses.length === 0 ? <div className='flex justify-center items-center'><p className='text-3xl text-center font-bold text-blue-200'>You have no enrolled courses...</p></div> : <div className='relative w-full mt-4'>

                    <div
                        className={`flex justify-center items-center flex-wrap no-scrollbar space-x-2 p-2 custom-scrollbar ${isDark ? "bg-black text-white" : "bg-white text-black"
                            }`}
                    >

                        {
                            enrolledCourses.map((course, index) => {
                                return (
                                    <SquishyCard
                                        className={isDark ? "bg-black text-white" : "bg-white text-black"}
                                        id={course._id}
                                        name={course.name}
                                        description={course.description}
                                        studentId={user._id}
                                        students={course.students}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default MyCourses;
