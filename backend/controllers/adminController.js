import { AssignmentModel } from "../models/assignmentModel.js";
import pool from "../database/mySQLClient.js";

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        res.status(201).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteAllUsers = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users');
        if (result.affectedRows > 0) {
            res.status(200).json({
                success: true,
                message: 'All users deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No users found to delete'
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses');
        res.status(201).json({
            success: true,
            courses: courses
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteAllCourses = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM courses');
        if (result.affectedRows > 0) {
            res.status(200).json({
                success: true,
                message: 'All courses deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No courses found to delete'
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await AssignmentModel.find({})
        res.status(201).json({
            success: true,
            assignments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}


