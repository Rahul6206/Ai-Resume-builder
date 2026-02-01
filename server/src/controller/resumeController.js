const Resume = require("../models/resume");
const { resumeSchema } = require("../validations/resumeValidation/resumeValidation");
const mongoose = require("mongoose");

async function createResume(req, res) {
  try {
    // Convert ObjectId → string for Zod validation
    const dataToValidate = {
      ...req.body,
      user: req.user?._id?.toString(),
    };

    // Validate incoming data
    const result = resumeSchema.safeParse(dataToValidate);

    if (!result.success) {
      console.error("Validation Error:", result.error);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors:
          result.error?.errors?.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })) || [],
      });
    }

    //  Destructure validated data
    const {
      user,
      fullname,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      profileSummary,
      education,
      technicalSkills,
      workExperience,
      projects,
      certifications,
      languages,
      interests,
    } = result.data;

    // Ensure user is valid before saving
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Create Resume in MongoDB
    const newResume = await Resume.create({
      user,
      fullname,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      profileSummary,
      education,
      technicalSkills,
      workExperience,
      projects,
      certifications,
      languages,
      interests,
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });

  } catch (error) {
    console.error("Resume Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// async function getResumeByUser(req, res) {
//   try {
//     const { userId } = req.params;

//     const resume = await Resume.findOne({ user: userId });
//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume not found for this user",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       resume,
//     });
//   } catch (error) {
//     console.error("Get Resume Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// }

async function getResumeByUser(req, res) {
  try {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}



const getUserResumes = async (req, res) => {
  try {
    const userId = req.user._id;

    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });

    if (!resumes || resumes.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No resumes found for this user.",
        resumes: [], // Explicitly send an empty array
      });
    }

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get Resume by User Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

async function updateResume(req, res) {
  try {
    const { id } = req.params;

    const result = resumeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const updatedResume = await Resume.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (updatedResume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied , You are not the owner of this resume" });
    }


    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function deleteResume(req, res) {
  try {
    const { id } = req.params;

    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createResume,
  getResumeByUser,
  updateResume,
  deleteResume,
  getUserResumes
};
