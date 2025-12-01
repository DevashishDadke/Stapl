import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import "./utils/db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

app.use(authMiddleware);

app.use("/api/activities", activityRoutes)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
