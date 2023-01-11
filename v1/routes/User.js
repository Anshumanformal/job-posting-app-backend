const router = require("express").Router();
const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
    destination: process.env.PWD + "/public/uploads/user",
    // destination: path.join(__dirname, "public", "uploads", "user"),
    filename: function (req, file, cb) {
        const extension = "".concat(file.originalname).split(".").pop();
        const filename = Date.now().toString(36);
        cb(null, `${filename}.${extension}`);
    },
});

const upload = multer({ storage });

const Auth = require("../../common/authenticate");
const Controller = require("../controllers");


// ONBOARDING APIs
router.post("/register", Controller.UserController.register);
router.post("/login", Controller.UserController.login);
router.get("/user", Controller.UserController.getAllUser);
router.get("/user/:id", Controller.UserController.getOneUser);

//Job-posting routes
router.post("/job-post/new", Controller.UserController.newJobPost)
router.get("/job-post", Controller.UserController.getAllJobPosts)
router.get("/job-post/:jobId", Controller.UserController.getOneJobPost)
router.patch("/job-post/:jobId", Controller.UserController.deleteJobPost) // soft delete a job post

// Apply job routes
router.post("/apply-job", Controller.UserController.applyForNewJob)
router.get("/:jobCreator/:jobId/view-all-job-applicants", Controller.UserController.viewAllJobApplicants)

module.exports = router;