const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const sendVerificationEmail = require("../utils/sendEmail.js");
const { signupValidation } = require("../validations/userValidation/signupValidation");
const { loginValidation } = require("../validations/userValidation/loginuserValidation");
const { verifySchema, emailSchema, resetPasswordSchema } = require("../validations/userValidation/validate");

const isProduction = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

function hashToken(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function issueTokens(user) {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const refreshToken = jwt.sign(
    { id: user._id, scope: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );

  return { accessToken, refreshToken };
}

async function persistRefreshToken(user, refreshToken) {
  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();
}

async function registerUser(req, res) {
  try {
    const result = signupValidation.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.issues.map((err) => ({ field: err.path[0], message: err.message })),
      });
    }

    const { fullname, email, password } = result.data;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await userModel.create({ fullname, email, password: hashedPassword, isVerified: false });

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    const result = loginValidation.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Validation error" });
    }

    const { email, password } = result.data;
    const user = await userModel
      .findOne({ email })
      .select("+password +refreshTokenHash +refreshTokenExpiry fullname email role isVerified");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        action: "VERIFY_OTP",
        email: user.email,
      });
    }

    const { accessToken, refreshToken } = issueTokens(user);
    await persistRefreshToken(user, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function verifyUser(req, res) {
  try {
    const result = verifySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Invalid verification payload" });
    }

    const { email, verifyCode } = result.data;
    const user = await userModel.findOne({ email }).select("+verifyCodeHash +verifyCodeExpiry");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

    if (!user.verifyCodeHash || user.verifyCodeExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "Verification code expired" });
    }

    if (hashToken(verifyCode) !== user.verifyCodeHash) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verifyCodeHash = null;
    user.verifyCodeExpiry = null;
    await user.save();

    const { accessToken, refreshToken } = issueTokens(user);
    await persistRefreshToken(user, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function sendOtp(req, res) {
  try {
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const { email } = result.data;
    
    const user = await userModel.findOne({ email }).select("+verifyCodeHash +verifyCodeExpiry");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    const verifyCode = generateOtp();
    const emailSent = await sendVerificationEmail(email, verifyCode);

    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Failed to send verification email" });
    }

    user.verifyCodeHash = hashToken(verifyCode);
    user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const { email } = result.data;
    const user = await userModel.findOne({ email }).select("+resetPasswordCodeHash +resetPasswordCodeExpiry");

    if (!user) {
      return res.status(200).json({ success: true, message: "If this email exists, reset code has been sent" });
    }

    const resetCode = generateOtp();
    const sent = await sendVerificationEmail(email, resetCode, "reset");
    if (!sent) return res.status(500).json({ success: false, message: "Failed to send reset code" });

    user.resetPasswordCodeHash = hashToken(resetCode);
    user.resetPasswordCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({ success: true, message: "If this email exists, reset code has been sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, message: "Validation error" });

    const { email, resetCode, newPassword } = result.data;
    const user = await userModel.findOne({ email }).select("+resetPasswordCodeHash +resetPasswordCodeExpiry");
    if (!user) return res.status(400).json({ success: false, message: "Invalid reset request" });

    if (!user.resetPasswordCodeHash || user.resetPasswordCodeExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "Reset code expired" });
    }

    if (hashToken(resetCode) !== user.resetPasswordCodeHash) {
      return res.status(400).json({ success: false, message: "Invalid reset code" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordCodeHash = null;
    user.resetPasswordCodeExpiry = null;
    user.refreshTokenHash = null;
    user.refreshTokenExpiry = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function refreshToken(req, res) {
  try {
    const token = req.body?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Refresh token missing" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (decoded.scope !== "refresh") {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const user = await userModel.findById(decoded.id).select("+refreshTokenHash +refreshTokenExpiry fullname email role");
    if (!user || !user.refreshTokenHash || user.refreshTokenExpiry < new Date()) {
      return res.status(401).json({ success: false, message: "Refresh token expired" });
    }

    if (hashToken(token) !== user.refreshTokenHash) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: nextRefreshToken } = issueTokens(user);
    await persistRefreshToken(user, nextRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Session refreshed",
      accessToken,
      refreshToken: nextRefreshToken,
      user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
}

async function logoutUser(req, res) {
  try {
    const refreshToken = req.body?.refreshToken;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        await userModel.findByIdAndUpdate(decoded.id, { refreshTokenHash: null, refreshTokenExpiry: null });
      }
    }

    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  sendOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
  getCurrentUser,
};
