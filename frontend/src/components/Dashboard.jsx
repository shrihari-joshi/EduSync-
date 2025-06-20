import React, { useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { Search, User, Bell, ChevronRight, Edit, Palette, Monitor, BarChart2, Mic, Moon, Sun, Server, Code, Gamepad } from 'lucide-react';
import {
    useColorModeValue,
    useColorMode,
    Box,
    IconButton
} from '@chakra-ui/react';
import PerformanceChart from './PerformanceChart.jsx';
import ContributionGrid from './ContributionGrid.jsx';
import axios from "axios";
import { getAllCourses } from '../APIRoutes/index.js';
import ReactFlowRoadmap from './Graphmap.jsx';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1])); // Decode and parse payload
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
};

const Dashboard = () => {
    // Correctly use Chakra UI's color mode hooks
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const [userName, setUserName] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get user from localStorage only once
    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem("user") || "{}");
    }, []);

    // Function to get an icon based on course tags - memoized to prevent recreating on every render
    const getCourseIcon = useMemo(() => {
        return (tags) => {
            if (!tags || tags.length === 0) return <Code className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;

            const tag = tags[0].toLowerCase();

            if (tag.includes('python') || tag.includes('programming')) {
                return <Code className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else if (tag.includes('machine') || tag.includes('ai')) {
                return <BarChart2 className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else if (tag.includes('cloud') || tag.includes('aws')) {
                return <Server className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else if (tag.includes('game') || tag.includes('unity')) {
                return <Gamepad className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else if (tag.includes('design')) {
                return <Palette className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else if (tag.includes('web')) {
                return <Monitor className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            } else {
                return <Edit className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />;
            }
        };
    }, [isDark]);

    useEffect(() => {
        // Set the user name
        setUserName(user.name || "Student");

        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${getAllCourses}/${user._id}`,
                    { withCredentials: true }
                );

                if (response?.data?.success) {
                    setEnrolledCourses(response.data.courses || []);
                    localStorage.setItem(
                        user?.role === 'Student' ? "student-courses" : 'teacher-courses',
                        JSON.stringify(response.data.courses)
                    );
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if we have a user ID
        if (user._id) {
            fetchCourses();
        } else {
            setIsLoading(false);
        }
    }, [user._id, user.name, user.role]);

    // Memoize these calculations to prevent recalculating on every render
    const { progressCourses, upcomingCourses, stats } = useMemo(() => {
        // Get courses in progress - limit to first 3
        const progressCourses = enrolledCourses.slice(0, 3).map((course, index) => {
            // Calculate a random progress for demo purposes
            // In a real app, this would come from user progress data
            const total = course.modules?.length || 1;
            const completed = Math.floor(Math.random() * total) + 1;

            return {
                id: course._id,
                title: course.name,
                level: course.difficulty <= 2 ? 'Beginner' : course.difficulty <= 3 ? 'Intermediate' : 'Advanced',
                completed: completed,
                total: total,
                color: isDark ? 'bg-indigo-300' : 'bg-indigo-300',
                icon: getCourseIcon(course.tags)
            };
        });

        // Get upcoming courses - if we have more than 3 enrollments, use the rest as "upcoming"
        const upcomingCourses = enrolledCourses.slice(3).map((course) => {
            // Create a random future date
            const randomDays = Math.floor(Math.random() * 14) + 1;
            const date = new Date();
            date.setDate(date.getDate() + randomDays);

            return {
                id: course._id,
                title: course.name,
                level: course.difficulty <= 2 ? 'Beginner' : course.difficulty <= 3 ? 'Intermediate' : 'Advanced',
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                duration: course.duration || '12h',
                icon: getCourseIcon(course.tags)
            };
        });

        // Calculate statistics based on actual data
        const stats = [
            { id: 1, value: Math.min(enrolledCourses.length, 3).toString(), label: 'Courses Completed' },
            { id: 2, value: enrolledCourses.length.toString(), label: 'Courses Enrolled' },
            {
                id: 3, value: (enrolledCourses.reduce((acc, course) =>
                    acc + (course.modules?.length || 0), 0)).toString(), label: 'Lessons Completed'
            }
        ];

        return { progressCourses, upcomingCourses, stats };
    }, [enrolledCourses, isDark, getCourseIcon]);

    const [animatedValues, setAnimatedValues] = useState([]);

    // Only run animation when stats change
    useEffect(() => {
        // Initialize with zeros
        setAnimatedValues(stats.map(stat => ({ id: stat.id, value: 0 })));

        const duration = 1500; // Animation duration in milliseconds
        const startTime = performance.now();
        let animationFrameId;

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1); // Normalize progress between 0 and 1

            setAnimatedValues(
                stats.map((stat) => ({
                    id: stat.id,
                    value: Math.floor(parseInt(stat.value) * progress), // Linear interpolation
                }))
            );

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        // Clean up animation on unmount or when stats change
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [stats]);

    // Sample data for graph (just the visual) - memoized to prevent recreation
    const { graphPoints, days } = useMemo(() => ({
        graphPoints: [10, 30, 15, 45, 25, 60, 20],
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }), []);

    // Loading state
    if (isLoading) {
        return (
            <div className={`min-h-screen p-6 flex justify-center items-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <p>Loading your courses...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Progress Section */}
            <section className="mb-6">
                <div className='flex justify-between items-center flex-row mb-6'>
                    <div>
                        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Welcome back, {userName}!</h1>
                        <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Here you can find the progress overview of your courses.</p>


                        <Link
                            to="/home/mycourses"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md mb-6 ${isDark ? "bg-indigo-300 text-white" : "bg-indigo-700 text-white"}`}
                        >
                            View Courses <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div>
                        <ContributionGrid />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {progressCourses.length > 0 ? (
                        progressCourses.map(course => (
                            <div key={course.id} className={`${course.color} rounded-lg p-6 relative ${isDark ? 'text-white' : ''}`}>
                                <div className="absolute right-4 top-4">⋮</div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                        {course.icon}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mt-2">{course.title}</h3>
                                <p className={`text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-600'}`}>{course.level}</p>

                                <div className="mt-6">
                                    <div className={`flex justify-between text-xs mb-1 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                                        <span>Lessons completed</span>
                                        <span>{course.completed}/{course.total}</span>
                                    </div>
                                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <div
                                            className={`h-2 rounded-full ${isDark ? 'bg-white' : 'bg-gray-600'}`}
                                            style={{ width: `${(course.completed / course.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`col-span-3 p-6 text-center rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                            <p>You are not enrolled in any courses yet.</p>
                            <Link to="/home/explore" className={`inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-md ${isDark ? "bg-indigo-300 text-white" : "bg-indigo-700 text-white"}`}>
                                Explore Courses <ChevronRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Statistics Section */}
            <section className="mb-6 flex flex-col">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {stats.map(stat => (
                        <div key={stat.id} className={`rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
                            <h3 className="text-4xl font-bold mb-1">
                                {animatedValues.find(s => s.id === stat.id)?.value || 0}
                            </h3>
                            <p className={isDark ? 'text-white' : 'text-gray-600'}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className={`rounded-lg flex flex-row p-6 relative ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    {/* Simple line chart visualization */}
                    <div className="w-2/5 pr-4 shadow-lg rounded-2xl mr-3">
                        <div className="mb-4 mt-6 ml-2">
                            <h3 className="text-4xl font-bold">6.4</h3>
                            <p className={isDark ? 'text-white' : 'text-gray-600'}>Hours spent this week</p>
                        </div>
                        <div className="h-32 flex items-end space-x-3 mt-20 ml-4">
                            {graphPoints.map((point, index) => (
                                <div
                                    key={index}
                                    className={`rounded-t-md mt-4 w-full ${isDark ? "bg-indigo-300" : "bg-indigo-300"}`}
                                    style={{
                                        height: `${point * 3}%`,
                                        maxWidth: "60px",
                                    }}
                                >
                                    {/* Bar value */}
                                    <div className="h-full"></div>

                                    {/* Day label below each bar */}
                                    <span className="block text-center text-xs mt-1 text-gray-500">
                                        {days[index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-3/5">
                        <PerformanceChart />
                    </div>
                </div>
            </section>

            {/* Upcoming Courses Section */}
            {upcomingCourses.length > 0 && (
                <section className="mb-6">
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Upcoming Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {upcomingCourses.map(course => (
                            <div key={course.id} className={`rounded-lg p-6 ${isDark ? 'bg-indigo-300 text-black' : 'bg-indigo-300 '}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        {course.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{course.title}</h3>
                                        <p className={`text-xs ${isDark ? 'text-gray-900' : 'text-gray-900'}`}>{course.level}</p>
                                    </div>
                                </div>
                                <div className={`text-sm ${isDark ? 'text-gray-900' : 'text-gray-900'}`}>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{course.date}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Duration:</span>
                                        <span>{course.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <ReactFlowRoadmap />
        </div>
    );
};

export default Dashboard;