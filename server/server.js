require("dotenv").config({ path: "./src/.env" });
const express = require("express");
const connectDB = require("./src/DB/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth");
const resumeRoutes = require("./src/routes/resume");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

const csrfExemptPaths = new Set([
  "/api/auth/user/login",
  "/api/auth/user/register",
  "/api/auth/user/sendOtp",
  "/api/auth/user/verify",
  "/api/auth/user/forgot-password",
  "/api/auth/user/reset-password",
  "/api/auth/user/refresh",
  "/api/auth/user/csrf-token",
]);

app.use((req, res, next) => {
  const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (safeMethod || csrfExemptPaths.has(req.path)) return next();

  const csrfHeader = req.headers["x-csrf-token"];
  const csrfCookie = req.cookies?.csrfToken;

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return res.status(403).json({ success: false, message: "Invalid CSRF token" });
  }

  next();
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

app.listen(process.env.PORT || 10000, () => {
  console.log(`App is running on PORT ${process.env.PORT || 10000}`);
});
