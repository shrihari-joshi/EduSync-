import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudinary.js";
import pool from '../../database/mySQLClient.js';


const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const getUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const createUser = async ({ username, name, email, password, role }) => {
  await pool.query(
    'INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [username, name, email, password, role]
  );
};

const updateUserProfile = async (id, { name, email, username, about, interests, image_url, image_public_id }) => {
  await pool.query(
    `UPDATE users SET 
            name = ?, 
            email = ?, 
            username = ?, 
            about = ?, 
            interests = ?, 
            image_url = ?, 
            image_public_id = ?
         WHERE id = ?`,
    [
      name,
      email,
      username,
      about,
      JSON.stringify(interests),
      image_url,
      image_public_id,
      id
    ]
  );
};


export const signupController = async (req, res) => { //based on MySQL
  try {
    const { name, username, email, password, role } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please enter all credentials",
      });
    }

    const existingMail = await getUserByEmail(email);
    if (existingMail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await createUser({
      username,
      password: hashedPass,
      name,
      email,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Sign Up Successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login Controller based on MySQL
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all credentials",
      });
    }
    const userData = await getUserByEmail(email);
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(error);
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
    if (req.body.interests) {
      try {
        interests = JSON.parse(req.body.interests);
      } catch (error) {
        console.error("Error parsing interests:", error);
      }
    }

    if (!name || !email || !username) {
      return res.status(401).json({
        success: false,
        message: "Name, email, and username are required fields",
      });
    }

    // Fetch user from MySQL
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let imageData = {
      url: user.image_url,
      publicId: user.image_public_id
    };

    // Handle image upload if provided
    if (req.files && req.files.image) {
      if (user.image_public_id) {
        try {
          await deleteFromCloud(user.image_public_id);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }

      const { image } = req.files;
      const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(401).json({
          success: false,
          message: "Only PNG, JPG, or JPEG files are allowed",
        });
      }

      try {
        const img = await uploadOnCloud(image.tempFilePath);
        imageData = {
          url: img.url,
          publicId: img.public_id,
        };
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
        });
      }
    }

    // Update user in MySQL using model function
    await updateUserProfile(id, {
      name,
      email,
      username,
      about: about || user.about,
      interests,
      image_url: imageData.url || null,
      image_public_id: imageData.publicId || null,
    });

    const updatedUser = await getUserById(id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
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
