const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Job Posting Schema
const DocSchema = new Schema(
    {
        jobId: { type: String, default: "", required: true, index: true},
        title: { type: String, default: "", required: true},
        description: { type: String, default: "", required: true},
        requiredSkills: [
            { type: String, default: "", required: true}
        ],
        experienceLevel: {type: String, default: "", required: true},
        email: { type: String, default: "", required: true, index: true},
        isDeleted: { type: Boolean, default: false, required: true},
    }
)

// DocSchema.methods.authenticate = function (password, callback) {
//     const promise = new Promise((resolve, reject) => {
//         if (!password) reject(new Error("MISSING_PASSWORD"));

//         bcrypt.compare(password, this.password, (error, result) => {
//             if (!result) reject(new Error("INVALID_PASSWORD"));
//             resolve(this);
//         });
//     });

//     if (typeof callback !== "function") return promise;
//     promise.then((result) => callback(null, result)).catch((err) => callback(err));
// };

// DocSchema.methods.setPassword = function (password, callback) {
//     const promise = new Promise((resolve, reject) => {
//         if (!password) reject(new Error("Missing Password"));

//         bcrypt.hash(password, 10, (err, hash) => {
//             if (err) reject(err);
//             this.password = hash;
//             resolve(this);
//         });
//     });

//     if (typeof callback !== "function") return promise;
//     promise.then((result) => callback(null, result)).catch((err) => callback(err));
// };

module.exports = mongoose.model("JobPosting", DocSchema);

