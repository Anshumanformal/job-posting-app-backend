const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.identify = Joi.object({
    id: Joi.objectId().required(),
});

module.exports.newJobPost = Joi.object({
    jobId : Joi.string().required(),
    title : Joi.string().required(),
    description : Joi.string().required(),
    requiredSkills : Joi.array().items(Joi.string()).required(),
    experienceLevel : Joi.string().required(),
    email : Joi.string().required()
})

module.exports.applyForNewJob = Joi.object({
    jobId : Joi.string().required(),
    name : Joi.string().required(),
    email : Joi.string().required(),
    resume : Joi.string().required(),
    coverLetter : Joi.string().required()
})