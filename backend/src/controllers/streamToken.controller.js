import { chatClient } from "../lib/stream.js";

/**
 * Generate a Stream token for the user with their Clerk ID,
 * and hand this token to the client in a response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>}
 */
export async function handleStreamToken(req, res) {
  try {
    const token = await chatClient.createToken(req.user.clerkId);

    return res.status(200).json({
      streamToken: token,
      userClerkId: req.user.clerkId,
      username: req.user.name,
      userAvatarUrl: req.user.image,
    });
  } catch (error) {
    console.error("Stream token handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
