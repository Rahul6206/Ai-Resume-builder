const { z } = require("zod");

const interestSchema = z.string().min(2, "Interest name is required");

module.exports = { interestSchema };
