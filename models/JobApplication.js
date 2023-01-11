const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Job Application Schema
const DocSchema = new Schema(
    {
        jobId : {type : String, default : "", required : true},
        applicants : [
            {type : String, default : "", required : true}
        ],
    }
)

module.exports = mongoose.model("JobApplication", DocSchema);

