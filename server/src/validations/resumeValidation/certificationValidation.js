const { z } = require("zod");

const certificationSchema = z.object({
    title: z.string().min(3, "Certificate title is required"),
    organization: z.string().optional(),
    issueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),

    credentialUrl: z
        .string()
        .url("Provide a valid credential URL")
        .optional()
        .or(z.literal("")) // <-- allow empty string
        .nullable(),
});

module.exports = { certificationSchema };
