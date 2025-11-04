import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // standard email regex pattern
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    profileImageUrl: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (v) {
          // allow empty string or valid URL
          if (v === "") return true;

          return /^https?:\/\/.+/.test(v);
        },
        message: "Profile image URL must be valid",
      },
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
