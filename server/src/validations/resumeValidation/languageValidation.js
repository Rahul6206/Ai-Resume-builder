const { z } = require("zod");

const languageSchema = z.string().min(2, "Language name is required");

module.exports = { languageSchema };
