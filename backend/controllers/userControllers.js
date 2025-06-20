import { UserModel } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudinary.js";
import { CourseModel } from "../models/courseModel.js";
import { TestModel } from "../models/testModel.js";

export const signupController = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please enter all credentials",
      });
    }
    const existingMail = await UserModel.findOne({ email: email });
    if (existingMail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    const existingUsername = await UserModel.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      password: hashedPass,
      name,
      email,
      role,
    });
    return res.status(201).json({
      success: true,
      messsage: "Sign Up Successful",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validUser = await UserModel.findOne({ email: email });

    if (!validUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const valid = await bcrypt.compare(password, validUser.password);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).json({
      success: true,
      message: "Signed In Successfully",
      token: token,
      user: validUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, username, branch, about } = req.body;
    let interests = [];

    // Parse interests if provided
    if (req.body.interests) {
      try {
        interests = JSON.parse(req.body.interests);
      } catch (error) {
        console.error("Error parsing interests:", error);
        // If parsing fails, continue with empty interests array
      }
    }

    // Validate required fields
    if (!name || !email || !username) {
      return res.status(401).json({
        success: false,
        message: "Name, email, and username are required fields",
      });
    }

    // Find the user
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle image upload if provided
    let imageData = null;
    if (req.files && req.files.image) {
      // Delete existing image if present
      if (user.image && user.image.publicId) {
        try {
          const response = await deleteFromCloud(user.image.publicId);
          console.log("Deleted previous image:", response);
        } catch (error) {
          console.error("Error deleting previous image:", error);
          // Continue even if deletion fails
        }
      }

      const { image } = req.files;

      // Validate image type
      const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(401).json({
          success: false,
          message: "Only PNG, JPG, or JPEG files are allowed",
        });
      }

      // Upload new image
      try {
        const img = await uploadOnCloud(image.tempFilePath);
        imageData = {
          url: img.url,
          publicId: img.public_id,
        };
        user.image = imageData;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
        });
      }
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.username = username;
    user.branch = branch || user.branch;
    user.about = about !== undefined ? about : user.about;
    user.interests = interests;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserByEmailController = async (request, response) => {
  try {
    const email = request.headers.email;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return response.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const personalizedroadmapController = async (req, res) => {
  try {
    const { course_id, student_id } = req.params;
    const tests = await TestModel.find({
      student: student_id,
      course: course_id,
    });

    let marks = 0;
    let total = 0;

    for (let test of tests) {
      marks += test.marks;
      total += test.evaluation.length * 2;
    }

    const average = marks / total;
    const modules = [];
    const course = await CourseModel.findById(course_id);

    for (let module of course.modules) {
      modules.push(module.title);
    }

    // Call Flask API to get module suggestions
    const response = await fetch(
      `${process.env.FLASK_URL}/generate-module-suggestions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modules,
          performance: average,
          student_id,
          course_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch module suggestions");
    }

    const suggestions = await response.json();

    return res.status(200).json({
      success: true,
      message: "Personalized roadmap generated successfully",
      roadmap: {
        performance: average,
        suggestions: suggestions.suggestions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
