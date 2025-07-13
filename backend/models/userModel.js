import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Student", "Teacher"],
    required: true,
  },
  enrolledCourses: {
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: "courses",
  },
  image: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  dob: {
    type: {
      day: Number,
      month: Number,
      year: Number,
    },
  },
  interests: {
    type: [String],
    default: [],
  },
  about: {
    type: String,
    default: "",
  },
});

export const UserModel = mongoose.model("users", UserSchema);
