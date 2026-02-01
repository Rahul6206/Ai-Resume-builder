const { z } = require("zod");

const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(3, "Institution is required"),

  // Accept string or number → convert to number →
  // validate minimum year
  startYear: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1900, {
      message: "Enter a valid start year",
    }),

  endYear: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val) => (val ? Number(val) : null))
    .refine((val) => val === null || val >= 1900, {
      message: "Enter a valid end year",
    }),

  percentage: z.string().optional(),
});

module.exports = { educationSchema };
