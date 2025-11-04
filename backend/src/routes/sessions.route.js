import express from "express";
import protectedRoutesHandlers from "../middlewares/protectRoute.middleware.js";
import {
  handleActiveSessions,
  handleCreateSession,
  handleEndSession,
  handleGetSession,
  handleJoinSession,
  handlePastSessions,
} from "../controllers/sessions.controller.js";

const router = express.Router();

router.post("/", protectedRoutesHandlers, handleCreateSession);
router.get("/active", protectedRoutesHandlers, handleActiveSessions);
router.get("/recent", protectedRoutesHandlers, handlePastSessions);
router.get("/:sessionId", protectedRoutesHandlers, handleGetSession);
router.post("/:sessionId/join", protectedRoutesHandlers, handleJoinSession);
router.post("/:sessionId/end", protectedRoutesHandlers, handleEndSession);

export default router;
