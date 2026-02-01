const userModel = require("../models/users");
const { signupValidation } = require("../validations/userValidation/signupValidation")
const { loginValidation } = require("../validations/userValidation/loginuserValidation")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendEmail");


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
};

//Register Route
async function registerUser(req, res) {
    try {
        const result = signupValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: result.error.issues.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
        }

        const { fullname, email, password } = result.data;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        

        // Create user (NOT verified yet)
        const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        

        return res.status(201).json({
            success: true, 
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}


//Login User
async function loginUser(req, res) {
    try {
        const result = loginValidation.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
            });
        }

        const { email, password } = result.data;

        const user = await userModel
            .findOne({ email })
            .select("+password isVerified email");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please register ",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
                action: "VERIFY_OTP",
                email: user.email,
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}


//OTP Verification
async function verifyUser(req, res) {
    
    try {
        const { email, verifyCode } = req.body;

        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "User not found" });

        if (user.isVerified)
            return res.status(400).json({ success: false, message: "User already verified" });

        if (user.verifyCode !== verifyCode)
            return res.status(400).json({ success: false, message: "Invalid verification code" });

        if (user.verifyCodeExpiry < new Date())
            return res.status(400).json({ success: false, message: "Verification code expired" });

        user.isVerified = true;
        user.verifyCode = null;
        user.verifyCodeExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

//Logout User
async function logoutUser(req, res) {
    res.clearCookie("token", cookieOptions);

    res.status(200).json({
        message: "User Logged Out Successfully"
    })
}

//send Otp

async function sendOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Generate OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = Date.now() + 10 * 60 * 1000;

    // Send email
    const emailSent = await sendVerificationEmail(email, verifyCode);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }

    // Save OTP
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
    sendOtp,
}