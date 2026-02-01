const { z } = require("zod");

const loginValidation = z.object({
    email: z
        .string(),
    password: z
        .string()
});

module.exports = { loginValidation };
