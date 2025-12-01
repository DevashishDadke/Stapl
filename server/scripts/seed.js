import dotenv from "dotenv";
import mongoose from "../utils/db.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

dotenv.config();

async function run() {
  const existing = await User.findOne({ email: "demo@stapl.io" });
  let user = existing;
  if (!user) {
    const hashed = await bcrypt.hash("Password@123", 10);
    user = new User({ name: "Demo User", email: "demo@stapl.io", password: hashed });
    await user.save();
  }

  const baseDate = new Date();
  const categories = ["Running", "Gym", "Cricket Nets", "Cycling"];
  const metrics = { Running: "distance", Gym: "reps", "Cricket Nets": "balls", Cycling: "distance" };

  const docs = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const cat = categories[i % categories.length];
    const metric = metrics[cat];
    docs.push({
      userId: user._id,
      category: cat,
      metric,
      value: metric === "distance" ? 5 + (i % 5) : 20 + (i % 10),
      duration: 30 + (i % 20),
      date: d
    });
  }

  await Activity.deleteMany({ userId: user._id });
  await Activity.insertMany(docs);
  console.log("Seeded", docs.length, "activities for", user.email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
