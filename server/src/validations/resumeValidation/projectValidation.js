const { z } = require("zod");

const projectSchema = z.object({
    title: z.string().trim().min(2, "Project title is required"),

    description: z
        .string()
        .trim()
        .min(10, "Description should be at least 10 characters"),

    techStack: z
        .array(
            z.string().trim().min(2, "Tech stack item cannot be empty")
        )
        .optional(),

    link: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
});

module.exports = { projectSchema };
