const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// User schema
const DocSchema = new Schema(
    {
        name: { type: String, default: "" },
        email: { type: String, default: "", index: true },
        resume: { type: String, default: ""},
        coverLetter: { type: String, default: ""}, // work on validation of this in markdown format
        isDeleted: { type: Boolean, default: false }
        // accessToken: { type: String, default: ""}
    }
)

module.exports = mongoose.model("User", DocSchema);

