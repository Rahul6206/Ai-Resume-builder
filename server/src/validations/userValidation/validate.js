const { z } = require("zod");

const verifySchema = z.object({
    verifyCode: z.string().length(6, { message: "Verification code must be 6 digits" })
});

module.exports={verifySchema}