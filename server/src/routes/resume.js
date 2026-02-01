const express = require("express");
const router = express.Router();
const resumeController = require("../controller/resumeController");
const verifyToken = require("../middleware/authMiddleware");

//Resume Routes
router.post("/resume/create", verifyToken, resumeController.createResume);
router.get("/resume/my_resume", verifyToken, resumeController.getUserResumes);
router.get("/resume/:resumeId",verifyToken, resumeController.getResumeByUser);
router.put("/resume/:id", verifyToken, resumeController.updateResume);
router.delete("/resume/:id", verifyToken, resumeController.deleteResume);

module.exports=router;