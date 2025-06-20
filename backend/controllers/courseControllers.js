import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import axios from "axios";
import { UserModel } from "../models/userModel.js";
import { ProgressModel } from "../models/progressModel.js";

export const createCourseController = async (req, res) => {
  try {
    const { name, description, instructor } = req.body;

    if (!name || !description || !instructor) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    let imageData = {
      url: null,
      publicId: null,
    };

    if (req.files) {
      const { image } = req.files;

      console.log(image);

      const types = ["image/jpg", "image/png", "image/jpeg"];
      if (!types.includes(image.mimetype)) {
        return res.status(401).json({
          success: false,
          message: "Use only png, jpg or jpeg files",
        });
      }

      const img = await uploadOnCloud(image.tempFilePath);
      imageData.url = img.url;
      imageData.publicId = img.public_id;
    }

    const course = await CourseModel.create({
      ...req.body,
      image: imageData,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCoursesByStudentController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate({
      path: "enrolledCourses",
      populate: { path: "instructor" },
    });

        const courses = user.enrolledCourses
        res.status(200).json({
            success: true,
            message:"Courses retrieved successfully",
            courses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getCourseRecommendation = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    // Get user details with interests
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Get all courses and ensure instructor details are fully populated
    const courses = await CourseModel.find({})
      .populate("instructor", "name email username about branch role") // Select only relevant fields
      .select('-password -__v'); // Exclude sensitive fields

    if (courses.length === 0) {
      return res.status(200).json({ success: true, courses: [] });
    }

    // Prepare courses data for the Flask API
    const coursesData = courses.map(course => ({
      _id: course._id.toString(),
      tags: course.tags,
    }));

      // Call Flask API
    const flaskResponse = await axios.post(
      `${process.env.FLASK_URL}/courses/recommendations`,
      {
        userInterests: user.interests,
        courses: coursesData
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      console.log(flaskResponse.data)

    // Get recommended course IDs from Flask
    const recommendedCourseIds = flaskResponse.data.courses.map(course => course._id);
    
    // Create a map for quick lookups of courses by ID
    const coursesMap = {};
    courses.forEach(course => {
      coursesMap[course._id.toString()] = course;
    });
    
    // Prepare full course details in the same order as recommended IDs
    const recommendedCoursesWithDetails = recommendedCourseIds.map(id => coursesMap[id]);
    // Send full course data to the frontend
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
    
    // First, find the course by ID to get its title and description
    const course = await CourseModel.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Prepare data for the Flask API
    const courseData = {
      courseTitle: course.name,
      courseDescription: course.description,
    };

    // Call Flask API to find similar courses
    const flaskResponse = await axios.post(
      `${process.env.FLASK_URL}/find-similar-courses`,
      courseData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the similar courses from the Flask API
    return res.status(200).json({
      success: true,
      message: "Similar courses found successfully",
      similarCourses: flaskResponse.data.similarCourses
    });

  } catch (error) {
    console.error("Error finding similar courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message
    });
  }
};

export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await CourseModel.find({}).populate("instructor");
    res.status(200).json({
      success: true,
      message: "Found all courses",
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCoursesByInstructor = async (req, res) => {
  try {
    const { instructorid } = req.headers;
    const courses = await CourseModel.find({ instructor: instructorid });
    res.status(200).json({
      success: true,
      message: "Found all courses",
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const enrollStudentController = async (req, res) => {
  try {
    const student = req.params.id;
    const { courseId } = req.body;
    const Course = await CourseModel.findById(courseId);

    if (!Course) {
      return res.status(401).json({
        success: false,
        message: "Course not found",
      });
    }

    if (Course.students.find((currstudent) => currstudent == student))
      return res.status(401).json({
        success: false,
        message: "Student already enrolled",
      });
    const Student = await UserModel.findById(student);

    if (!Student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!Course)
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });

    await ProgressModel.create({ student: student, course: courseId });
    Course.students.push(student);
    Student.enrolledCourses.push(courseId);
    await Course.save();
    await Student.save();
    res.status(201).json({
      success: true,
      message: "Student enrolled",
      Course,
    });
  } catch (error) {
    console.log(error);
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

    // Find the course and student
    const Course = await CourseModel.findById(courseId);
    const Student = await UserModel.findById(studentId);

    if (!Course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!Student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Remove the student from the course's student list
    Course.students = Course.students.filter(
      (student) => student.toString() !== studentId
    );

    Student.enrolledCourses = Student.enrolledCourses.filter(
      (course) => course.toString() !== courseId
    );

    // Save the changes
    await Course.save();
    await Student.save();

    res.status(200).json({
      success: true,
      message: "Student unenrolled successfully",
      Course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const generateQuizController = async (req, res) => {
  try {
    const { id, idx } = req.params;
    const courseId = id;
    const ModuleIndex = idx;
    const course = await CourseModel.findById(courseId);
    const description = course.modules[ModuleIndex].description;
    const response = await axios.post(
      `${process.env.FLASK_URL}/quiz`,
      { description },
      {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(response.data);
    course.modules[ModuleIndex].quiz.questions = response.data.quiz;
    course.save();
    res.status(200).json({
      success: true,
      message: "Generated quiz",
      course,
      quiz: response.data.questions,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuizController = async (req, res) => {
  try {
    const { id, idx } = req.params;
    const courseId = id;
    const ModuleIndex = idx;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    const module = course.modules[ModuleIndex];
    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module not found",
      });
    }
    const quiz = module.quiz;
    if (!quiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quiz found",
      quiz,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course found",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getLeaderboard = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    // Initialize leaderboard with students and marks set to 0
    let leaderboard = [];
    for (let i = 0; i < course.students.length; i++) {
      let student = course.students[i];
      const Student = await UserModel.findById(student);
      leaderboard.push({ name: Student.name, student: student, marks: 0 });
    }
    // Loop through assignments
    for (let i = 0; i < course.assignments.length; i++) {
      let assignment = await AssignmentModel.findById(course.assignments[i]);
      // Ensure the assignment has submissions
      if (!assignment.submissions) continue;
      // Debug: Log the assignment and its submissions
      console.log("Processing assignment:", assignment._id);
      console.log("Submissions:", assignment.submissions);
      // Loop through submissions in each assignment
      for (let j = 0; j < assignment.submissions.length; j++) {
        let submission = assignment.submissions[j];
        // Ensure the submission has a student field and a grade
        if (!submission || !submission.student || !submission.grade) {
          console.log(`Invalid submission:`, submission);
          continue;
        }
        // Debug: Log each submission student and grade
        console.log(
          `Submission student ID: ${submission.student}, Grade: ${submission.grade}`
        );
        // Find the student in the leaderboard by comparing their ID
        let index = leaderboard.findIndex(
          (entry) => entry.student.toString() == submission.student.toString()
        );
        // Ensure student is found in the leaderboard
        if (index !== -1) {
          leaderboard[index].marks += submission.grade; // Add the student's grade to their total marks
          console.log(
            `Updated marks for student ${submission.student}: ${leaderboard[index].marks}`
          );
        } else {
          console.log(
            `Student not found in leaderboard: ${submission.student.toString()}`
          );
        }
      }
    }
    // Return the leaderboard
    res.status(200).json({
      success: true,
      message: "Leaderboard generated",
      leaderboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createRoadmapController = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    const description = course.description;
    const response = await axios.post(
      `${process.env.FLASK_URL}/roadmap`,
      { description },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(response.data);
    course.modules = response.data.modules;
    course.save();
    res.status(200).json({
      success: true,
      message: "Created roadmap successfully",
      roadmap: course.roadmap,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadContentController = async (request, response) => {
  try {
    const courseId = request.params.id;
    const roadmapId = request.headers.roadmapid;

    // Ensure request.files is defined and check for the expected key 'content'
    if (!request.files || !request.files.content) {
      return response.status(400).json({
        success: false,
        message: "Please provide a video file in the 'content' field",
      });
    }

    const { content } = request.files;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return response.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check video MIME type
    if (!["video/mp4", "video/webm", "video/ogg"].includes(content.mimetype)) {
      return response.status(401).json({
        success: false,
        message: "Use only video formats (mp4, webm, ogg)",
      });
    }

    // Upload video to cloud and get URL
    const { public_id, url } = await uploadOnCloud(content.tempFilePath);
    console.log("public_id, url", public_id, url);

    // Update the specific roadmap item to add the video URL
    const updatedCourse = await CourseModel.updateOne(
      { _id: courseId, "roadmap._id": roadmapId },
      { $push: { "roadmap.$.links": url } }
    );

    if (updatedCourse.nModified === 0) {
      return response.status(400).json({
        success: false,
        message: "Roadmap item not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Video link added successfully",
      url,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
