const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            maxlength: [100, "Full name must not exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
        },
        linkedin: { type: String, trim: true },
        github: { type: String, trim: true },
        portfolio: { type: String, trim: true },

        profileSummary: {
            type: String,
            required: [true, "Profile summary is required"],
            maxlength: [800, "Summary must not exceed 800 characters"],
        },

        education: [
            {
                degree: { type: String, required: true, trim: true },
                institution: { type: String, required: true, trim: true },
                startYear: { type: Number, required: true },
                endYear: { type: Number },
                percentage: { type: String },
            },
        ],

        technicalSkills: {
            type: [String],
            required: [true, "At least one technical skill is required"],
        },

        workExperience: [
            {
                company: { type: String, required: true, trim: true },
                position: { type: String, required: true, trim: true },
                startDate: { type: Date, required: true },
                endDate: { type: Date },
                description: { type: String, maxlength: 500 },
            },
        ],

        projects: [
            {
                title: { type: String, required: true, trim: true },
                description: { type: String, required: true },
                technologies: [String],
                link: { type: String, trim: true },
                githubLink: { type: String, trim: true },
            },
        ],

        certifications: [
            {
                title: { type: String, required: true },
                organization: { type: String },
                issueDate: { type: Date },
                credentialUrl: { type: String },
            },
        ],

        languages: {
            type: [String],
            default: ["English"],
        },

        interests: [String],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
