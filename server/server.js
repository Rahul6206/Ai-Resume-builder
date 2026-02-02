require("dotenv").config({ path: "./src/.env" })
const express = require("express");
const connectDB = require("./src/DB/db");
const app = express();
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const resumeRoutes = require("./src/routes/resume");
const aiRoutes = require("./src/routes/aiRoutes")
const cookieParser = require("cookie-parser");


app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

connectDB();

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api", resumeRoutes);
app.use("/api/ai", aiRoutes);


app.listen(process.env.PORT || 10000, () => {
    console.log(`App is running on the PORT ${process.env.PORT || 10000}`);
});