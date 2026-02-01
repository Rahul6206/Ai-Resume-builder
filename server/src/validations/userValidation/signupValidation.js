const { z } = require("zod");

const signupValidation = z.object({
    fullname: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim(),

    email: z
        .string()
        .email("Please enter a valid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

module.exports = { signupValidation };
