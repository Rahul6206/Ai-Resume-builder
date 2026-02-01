const { z } = require("zod");

const skillSchema = z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters");

module.exports = { skillSchema };
