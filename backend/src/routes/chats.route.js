import express from "express";
import { handleStreamToken } from "../controllers/streamToken.controller.js";
import protectedRoutesHandlers from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.get("/token", protectedRoutesHandlers, handleStreamToken);

export default router;
