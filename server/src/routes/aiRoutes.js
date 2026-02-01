const express = require("express");
const router = express.Router();
const AiController = require("../controller/aiController");
const verifyToken = require("../middleware/authMiddleware");


router.post("/generate-resume",verifyToken,AiController.GenerateAiResume );

module.exports=router;