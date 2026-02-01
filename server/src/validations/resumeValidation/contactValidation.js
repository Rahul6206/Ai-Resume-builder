const { z } = require("zod");

const contactSchema = z.object({
    email: z.string().email("Invalid email address"),

    phone: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits")
        .optional(),

    linkedin: z
        .string()
        .url("Invalid LinkedIn URL")
        .includes("linkedin.com", { message: "Must be a LinkedIn profile URL" })
        .optional(),

    github: z
        .string()
        .url("Invalid GitHub URL")
        .includes("github.com", { message: "Must be a GitHub profile URL" })
        .optional(),

    portfolio: z
        .string()
        .url("Invalid portfolio URL")
        .optional(),

    address: z.string().optional(),
});

module.exports = { contactSchema };
