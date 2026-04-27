const { z } = require("zod");
const { strongPassword } = require("./signupValidation");

const verifySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  verifyCode: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

const emailSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  resetCode: z.string().regex(/^\d{6}$/, "Reset code must be 6 digits"),
  newPassword: strongPassword,
});

module.exports = { verifySchema, emailSchema, resetPasswordSchema };
