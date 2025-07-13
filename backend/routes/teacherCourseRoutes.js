import express from "express";
import {
  createCourseController,
  getAllCoursesByInstructor,
  getCourseById,
} from "../controllers/courseControllers.js";

const router = express.Router();

router.route("/").post(createCourseController).get(getAllCoursesByInstructor);
router.route("/get-course/:id/").get(getCourseById);


export const teacherCourseRouter = router;
