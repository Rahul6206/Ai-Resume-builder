const express = require("express");
const router = express.Router();
const resumeController = require("../controller/resumeController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, resumeController.createResume);
router.get("/my_resume", verifyToken, resumeController.getUserResumes);
router.get("/:resumeId", verifyToken, resumeController.getResumeByUser);
router.put("/:id", verifyToken, resumeController.updateResume);
router.delete("/:id", verifyToken, resumeController.deleteResume);

module.exports = router;
