require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

console.log("ENV URI:", process.env.MONGODB_URI);

const connectDB = require("../config/db");
const authRoutes = require("../routes/auth");
const dashboardRoutes = require("../routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ errors: [{ msg: "Server error" }] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
