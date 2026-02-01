const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required"],
        minlength: [3, "Name must be at least 2 characters"],
        maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    verifyCode: {
        type: String,
        default:null,
    },
    verifyCodeExpiry: {
        type: Date,
        default:null,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("User", userSchema);
