import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function handleCreateSession(req, res) {
  try {
    const { problemTitle, difficulty } = req.body;
    const dbUserId = req.user._id;
    const clerkUserId = req.user.clerkId;

    if (!problemTitle || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem title and difficulty are required!" });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Create session document
    const session = await Session.create({
      problemTitle,
      difficulty: difficulty.toLowerCase(),
      hostId: dbUserId,
      callId,
    });

    // Create Stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkUserId,
        custom: {
          problemTitle,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // Create chat channel
    const channel = chatClient.channel("messaging", callId, {
      name: `${problemTitle} session`,
      created_by_id: clerkUserId,
      members: [clerkUserId],
    });
    await channel.create();

    return res.status(201).json({ session });
  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({
      message: "Failed to create session. Please try again.",
    });
  }
}

export async function handleActiveSessions(_, res) {
  try {
    const activeSessions = await Session.find({ status: "active" })
      .populate("hostId", "clerkId name email profileImageUrl")
      .populate("participantId", "clerkId name email profileImageUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions: activeSessions });
  } catch (error) {
    console.error("Active sessions error:", error);
    return res.status(500).json({
      message: "Failed to fetch sessions.",
    });
  }
}

export async function handlePastSessions(req, res) {
  try {
    const dbUserId = req.user._id;

    const pastSessions = await Session.find({
      status: "completed",
      $or: [{ hostId: dbUserId }, { participantId: dbUserId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions: pastSessions });
  } catch (error) {
    console.error("Past sessions error:", error);
    return res.status(500).json({
      message: "Failed to fetch past sessions.",
    });
  }
}

export async function handleGetSession(req, res) {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("hostId", "clerkId name email profileImageUrl")
      .populate("participantId", "clerkId name email profileImageUrl");

    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      message: "Failed to fetch session.",
    });
  }
}

export async function handleJoinSession(req, res) {
  try {
    const { sessionId } = req.params;
    const dbUserId = req.user._id;
    const clerkUserId = req.user.clerkId;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        message: "This session has ended.",
      });
    }

    if (session.hostId.toString() === dbUserId.toString()) {
      return res.status(400).json({
        message: "You cannot join your own session as a participant!",
      });
    }

    const participantAlreadyAssigned =
      session.participantId &&
      session.participantId.toString() === dbUserId.toString();

    if (
      session.participantId &&
      session.participantId.toString() !== dbUserId.toString()
    ) {
      return res.status(409).json({
        message: "Session is full!",
      });
    }

    if (!participantAlreadyAssigned) {
      // Update session
      session.participantId = dbUserId;
      await session.save();

      // Add to chat channel
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkUserId]);
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Join session error:", error);
    return res.status(500).json({
      message: "Failed to join session. Please try again.",
    });
  }
}

export async function handleEndSession(req, res) {
  try {
    const { sessionId } = req.params;
    const dbUserId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    if (session.hostId.toString() !== dbUserId.toString()) {
      return res.status(403).json({
        message: "Only the host can end this session!",
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session is already completed!",
      });
    }

    // Delete Stream resources
    const videoCall = streamClient.video.call("default", session.callId);
    await videoCall.delete({ hard: true });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete({ hard_delete: true });

    // Mark session as completed
    session.status = "completed";
    await session.save();

    return res.status(200).json({
      session,
      message: "Session ended successfully!",
    });
  } catch (error) {
    console.error("End session error:", error);
    return res.status(500).json({
      message: "Failed to end session.",
    });
  }
}
