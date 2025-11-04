import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

const protectedRoutesHandlers = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { clerkId } = req.auth().userId;

      if (!clerkId)
        return res
          .status(401)
          .json({ message: "Unauthorized — User's Clerk ID is missing!" });

      const user = await User.findOne({ clerkId });

      if (!user) return res.status(404).json({ message: "User Not Found!" });

      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protected route handler:", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
];

export default protectedRoutesHandlers;
