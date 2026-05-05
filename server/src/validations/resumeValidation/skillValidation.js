const { z } = require("zod");

const skillSchema =  z.string().min(2, "technicalSkills must me required least 2 characters");


module.exports = { skillSchema };

// const interestSchema = z.string().min(2, "Interest name is required");