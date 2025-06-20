import express from "express";
import {
  enrollStudentController,
  getAllCoursesByStudentController,
  getAllCoursesController,
  getCourseById,
    unenrollStudentController,
  getCourseRecommendation,
  findSimilarCoursesController
} from "../controllers/courseControllers.js";
import { evaluationController } from "../controllers/testControllers.js";
const router = express.Router();

//api/v1/user/student/course

router
    .route("/:id")
    .post(enrollStudentController)
    .get(getAllCoursesByStudentController)
    .delete(unenrollStudentController);

router.route("/").get(getAllCoursesController);
router.route("/give/recommendation").post(getCourseRecommendation);
router.get('/similar-courses/:id',findSimilarCoursesController);

router.route("/get-course/:id").get(getCourseById);

router.route("/quiz").post(evaluationController);
router.route("/get-course/:id").get(getCourseById);

export const studentCourseRouter = router;
