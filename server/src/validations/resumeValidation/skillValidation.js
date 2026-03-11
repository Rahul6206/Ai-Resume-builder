const { z } = require("zod");

const skillSchema =  z.string().min(2, "Skill name must be at least 2 characters");


module.exports = { skillSchema };

// const interestSchema = z.string().min(2, "Interest name is required");