import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  contents: [
    {
      type: {
        type: String,
        enum: ["video", "note", "practice", "text", "other"],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: String,
      resource: {
        url: String,
        duration: Number,
        publicId: String,
      },
      tags: {
        type: [String],
        default: [],
      },
    },
  ],
  quiz: {
    questions: [
      {
        question: { type: String, required: true },
        options: {
          a: { type: String, required: true },
          b: { type: String, required: true },
          c: { type: String },
          d: { type: String },
        },
        answer: { type: String, required: true },
        // Map each question to specific skills/concepts
        conceptTags: {
          type: [String],
          default: [],
        },
        difficulty: {
          type: Number,
          default: 1, // 1-5 scale
        },
      },
    ],
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
  },
});

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  students: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  assignments: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  modules: {
    type: [ModuleSchema],
    default: [],
  },
  initialAssessment: {
    type: [
      {
        question: { type: String, required: true },
        options: {
          a: { type: String, required: true },
          b: { type: String, required: true },
          c: { type: String, required: true },
          d: { type: String, required: true },
        },
        answer: { type: String, required: true },
        conceptTags: {
          type: [String],
          default: [],
        },
      },
    ],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [
      {
        student: mongoose.Types.ObjectId,
        review: String,
        rating: Number,
      },
    ],
    default: [],
  },
});

export const CourseModel = mongoose.model("courses", CourseSchema);
