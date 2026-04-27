const { z } = require("zod");

const loginValidation = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(4, "Password must be at least 8 characters").max(72),
});

module.exports = { loginValidation };
