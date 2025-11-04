import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function handleCreateSession(req, res) {
  try {
    const { problemTitle, difficulty } = req.body;
    const dbUserId = req.user._id; // user's MongoDB ID
    const clerkUserId = req.user.clerkId; // user's Clerk ID

    if (!problemTitle || !difficulty) {
      res
        .status(400)
        .json({ message: "Problem title and/or difficulty are/is required!" });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Create a session document in MongoDB
    const session = await Session.create({
      problemTitle,
      difficulty,
      hostId: dbUserId,
      callId,
    });

    // Create Stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkUserId,
        custom: { problemTitle, difficulty, sessionId: session._id.toString() },
      },
    });

    // Set up chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problemTitle} session`,
      created_by_id: clerkUserId,
      members: [clerkUserId],
    });

    await channel.create();

    return res.status(201).json(session);
  } catch (error) {
    console.error("Create session handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function handleActiveSessions(_, res) {
  try {
    const activeSessions = await Session.find({ status: "active" })
      .populate("hostId", "clerkId name email profileImageUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(activeSessions);
  } catch (error) {
    console.error("Active sessions handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function handlePastSessions(req, res) {
  try {
    const dbUserId = req.user._id; // user's MongoDB ID

    // Get sessions the user hosted or participated in
    const pastSessions = await Session.find({
      status: "completed",
      $or: [{ hostId: dbUserId }, { participantId: dbUserId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(pastSessions);
  } catch (error) {
    console.error("Past sessions handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function handleGetSession(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate("hostId", "clerkId name email profileImageUrl")
      .populate("participantId", "clerkId name email profileImageUrl");

    if (!session) {
      return res.status(404).json({ message: "Session Not Found!" });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error("Get session handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function handleJoinSession(req, res) {
  try {
    const { sessionId } = req.params;
    const dbUserId = req.user._id; // user's MongoDB ID
    const clerkUserId = req.user.clerkId; // user's Clerk ID

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session Not Found!" });
    }

    if (session.participantId) {
      return res.status(400).json({ message: "Session is already full!" });
    }

    // Make the user a participant of the intended session
    session.participantId = dbUserId;
    await session.save();

    // Make the user a member of the session chat
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkUserId]);

    return res.status(200).json(session);
  } catch (error) {
    console.error("Join session handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function handleEndSession(req, res) {
  try {
    const { sessionId } = req.params;
    const dbUserId = req.user._id; // user's MongoDB ID

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session Not Found!" });
    }

    if (session.hostId.toString() === dbUserId.toString()) {
      return res.status(403).json({ message: "Only hosts can end sessions!" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed!" });
    }

    session.status = "completed";
    await session.save();

    // Delete the session video call and the chat channel
    const videoCall = streamClient.video.call("default", session.callId);
    await videoCall.delete({ hard: true });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete({ hard_delete: true });

    return res
      .status(200)
      .json({ session, message: "Session ended successfully!" });
  } catch (error) {
    console.error("End session handler error:", error.message);

    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
