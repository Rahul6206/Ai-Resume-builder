const { z } = require("zod");

const strongPassword = z
  .string()
  .min(4, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")

const signupValidation = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters").max(50).trim(),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: strongPassword,
});

module.exports = { signupValidation, strongPassword };
