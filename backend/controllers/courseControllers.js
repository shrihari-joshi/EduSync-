import { CourseModel } from "../models/courseModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import axios from "axios";
import { UserModel } from "../models/userModel.js";
import { ProgressModel } from "../models/progressModel.js";
import pool from '../database/mySQLClient.js';


export const createCourseController = async (req, res) => {
  try {
    const { name, description, instructor = 2, price = 0, duration = '', rating = 0, difficulty = 0 } = req.body;

    if (!name || !description || !instructor) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    let imageData = {
      url: null,
      publicId: null,
    };

    if (req.files) {
      const { image } = req.files;

      const img = await uploadOnCloud(image.tempFilePath);
      imageData.url = img.url;
      imageData.publicId = img.public_id;
    }

    const [result] = await pool.query(
      `INSERT INTO courses 
        (name, instructor_id, description, price, duration, rating, difficulty, image_url, image_public_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        instructor,
        description,
        price,
        duration,
        rating,
        difficulty,
        imageData.url,
        imageData.publicId,
      ]
    );

    const insertedCourseId = result.insertId;

    const [courseRows] = await pool.query('SELECT * FROM courses WHERE id = ?', [insertedCourseId]);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: courseRows[0],
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAllCoursesByStudentController = async (req, res) => {
  try {
    const studentId = req.params.id;

    const [courses] = await pool.query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         u.email AS instructor_email 
       FROM course_enrollments ce
       JOIN courses c ON ce.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE ce.student_id = ?`,
      [studentId]
    );

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const enrollStudentController = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { courseId } = req.body;

    // Check if course exists
    const [courseRows] = await pool.query(`SELECT * FROM courses WHERE id = ?`, [courseId]);
    if (courseRows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if student exists
    const [studentRows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Check if already enrolled
    const [enrollment] = await pool.query(
      `SELECT * FROM course_enrollments WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    if (enrollment.length > 0) {
      return res.status(400).json({ success: false, message: "Student already enrolled" });
    }

    // Enroll student
    await pool.query(
      `INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)`,
      [studentId, courseId]
    );

    res.status(201).json({
      success: true,
      message: "Student enrolled",
    });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unenrollStudentController = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { courseId } = req.body;

    // Check if enrollment exists
    const [enrollment] = await pool.query(
      `SELECT * FROM course_enrollments WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    if (enrollment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // Delete the enrollment
    await pool.query(
      `DELETE FROM course_enrollments WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    res.status(200).json({
      success: true,
      message: "Student unenrolled successfully",
    });
  } catch (error) {
    console.error("Error unenrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCoursesController = async (req, res) => {
  try {
    const [courses] = await pool.query(
      `SELECT 
         courses.*, 
         users.name AS instructor_name, 
         users.email AS instructor_email 
       FROM courses 
       JOIN users ON courses.instructor_id = users.id`
    );

    res.status(200).json({
      success: true,
      message: "Found all courses",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCoursesByInstructor = async (req, res) => {
  try {
    const { instructorid } = req.headers;

    const [courses] = await pool.query(
      `SELECT * FROM courses WHERE instructor_id = ?`,
      [instructorid]
    );

    res.status(200).json({
      success: true,
      message: "Found courses by instructor",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses by instructor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const [rows] = await pool.query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         u.email AS instructor_email 
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.id = ?`,
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course found",
      course: rows[0],
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// last option
export const getCourseRecommendation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    // Fetch user with interests
    const [userRows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = userRows[0];
    let userInterests = [];

    // Parse user interests (assumes JSON stored in TEXT or JSON column)
    try {
      userInterests = JSON.parse(user.interests || '[]');
    } catch (e) {
      console.warn('Failed to parse interests:', e);
    }

    // Get all courses with their tags
    const [courses] = await pool.query(`
      SELECT 
        c.id AS course_id,
        c.name,
        c.tags,
        c.description,
        c.instructor_id,
        c.price,
        c.duration,
        c.rating,
        c.difficulty,
        c.image_url,
        u.name AS instructor_name,
        u.email AS instructor_email,
        GROUP_CONCAT(ct.tag) AS tag_list
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN course_tags ct ON ct.course_id = c.id
      GROUP BY c.id
    `);

    if (courses.length === 0) {
      return res.status(200).json({ success: true, courses: [] });
    }

    // Prepare payload for Flask
    const coursesForFlask = courses.map(course => ({
      _id: course.course_id.toString(),
      tags: (course.tag_list ? course.tag_list.split(',') : [])
    }));

    // Send to Flask recommender
    const flaskResponse = await axios.post(
      `${process.env.FLASK_URL}/courses/recommendations`,
      {
        userInterests,
        courses: coursesForFlask
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const recommendedCourseIds = flaskResponse.data.courses.map(c => parseInt(c._id));

    // Map course_id to full course for lookup
    const coursesMap = {};
    courses.forEach(course => {
      coursesMap[course.course_id] = course;
    });

    // Maintain the order returned by Flask
    const recommendedCoursesWithDetails = recommendedCourseIds
      .filter(id => coursesMap[id])
      .map(id => coursesMap[id]);

    return res.status(200).json({
      success: true,
      courses: recommendedCoursesWithDetails
    });

  } catch (error) {
    console.error("Error in course recommendation:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
};

export const findSimilarCoursesController = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Get course details by ID
    const [courseRows] = await pool.query(
      `SELECT name, description FROM courses WHERE id = ?`,
      [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = courseRows[0];

    // Prepare payload for Flask
    const courseData = {
      courseTitle: course.name,
      courseDescription: course.description,
    };

    // Send to Flask API
    const flaskResponse = await axios.post(
      `${process.env.FLASK_URL}/find-similar-courses`,
      courseData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the similar courses
    return res.status(200).json({
      success: true,
      message: "Similar courses found successfully",
      similarCourses: flaskResponse.data.similarCourses,
    });

  } catch (error) {
    console.error("Error finding similar courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};
