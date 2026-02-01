const { z } = require("zod");

const workExperienceSchema = z.object({
    company: z.string().min(2, "Company name is required"),
    position: z.string().min(2, "Position is required"),

    // Safer date parsing & validation
    startDate: z.coerce.date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid start date format"
    }),

    endDate: z
        .union([
            z.coerce.date().optional(),
            z.literal("").optional() // allow empty string
        ])
        .optional(),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

module.exports = { workExperienceSchema };
