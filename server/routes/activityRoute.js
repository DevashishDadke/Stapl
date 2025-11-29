import express from "express";
import {
  logActivity,
  getActivities,
  getInsights,
  getConsistencyScore
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/analytics/consistency", getConsistencyScore);

router.post("/log", logActivity);

router.get("/", getActivities);

router.get("/insights", getInsights);

export default router;
