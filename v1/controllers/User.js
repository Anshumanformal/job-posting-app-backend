const Model = require("../../models");
const Validation = require("../validations");
const Auth = require("../../common/authenticate");
const Services = require("../../services/index");
const functions = require("../../common/functions");
const bcrypt = require('bcryptjs');

module.exports.register = async (req, res, next) => {
    try {
        await Validation.User.register.validateAsync(req.body);

        let user = await Model.User.findOne({
            email: req.body.email,
            isDeleted : false,
        })
        
        if(user) return res.error(`USER_WITH_THIS_EMAIL_ALREADY_EXISTS_PLEASE_LOGIN`, 400);
        //Creating new user.
        user = await Model.User.create(req.body);

        let emailObj = {
            to: req.body.email,
            title: `You have been successfully registered`,
            message: `Hi user, You have been successfully registered with email : ${req.body.email}`,
        };

        //Nodemailer service for sending email.
        // await Services.EmailService.sendEmail(emailObj);  // Configure this at last. More emails sent can disable the email account.
        return res.success("USER_REGISTERED_SUCCESSFULLY", user);

    } catch (error) {
        next(error);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        await Validation.User.login.validateAsync(req.body);

        let user = await Model.User.findOne({email : req.body.email, isDeleted : false});
        if(!user) return res.error("USER_NOT_FOUND", 400);

        res.success("USER_LOGGED_IN_SUCCESSFULLY", user);

    } catch (error) {
        next(error);
    }
}

module.exports.getAllUser = async (req, res, next) => {
    try {

        let page = req.query.page ? Number(req.query.page) : 1;
        let count = req.query.count ? Number(req.query.count) : 10;
        let skipNo = Number((page - 1) * count);
        let sort = { _id: -1 };

        let query = { isDeleted: false};
        
        let active_key = {
            name : 1,
            email : 1,
        }
        //Or we can write.
        // let active_key = 'email password accessToken';

        let doc = await Model.User.find(query).sort(sort).limit(count).skip(skipNo).select(active_key);
        const itemCount = await Model.User.find(query).countDocuments(query);
        let sendObj = { itemCount, doc };

        return res.success("USER_DATA_FETCHED", sendObj);

    } catch (error) {
        next(error);
    }
}

module.exports.getOneUser = async (req, res, next) => {
    try {

        let doc = await Model.User.findOne({ _id: req.params.id, isDeleted : false}).lean();

        return res.success("USER_DATA_FETCHED", doc);
    } catch (error) {
        next(error);
    }
}


module.exports.updateOneUser = async (req, res, next) => {
    try {
        await Validation.User.updateUser.validateAsync(req.body);

        const filter = { _id: req.params.id };
        const update = req.body;
        const options = {
            new: true,
        };

        let doc = await Model.User.findOneAndUpdate(filter, update, options);

        return res.success("USER_DATA_UPDATED_SUCCESSFULLY", doc);
    } catch (error) {
        next(error);
    }
}

module.exports.updatePassword = async (req, res, next) => {
    try {

        await Validation.User.updatePassword.validateAsync(req.body);

        let user = await Model.User.findOne({_id : req.user._id, isDeleted : false});

        let passwordOk = await bcrypt.compare(req.body.password, user.password);
        // console.log('passwordOk----------', passwordOk);
        
        await user.setPassword(req.body.password);
        return res.success("PASSWORD_UPDATED_SUCCESSFULLY");

    } catch (error) {
        next(error);
    }
}

module.exports.newJobPost = async (req, res, next) => {
    try {
        await Validation.JobPost.newJobPost.validateAsync(req.body);

        let jobId = await Model.JobPosting.findOne({
            jobId: req.body.jobId,
            isDeleted : false,
        })
        
        if(jobId) return res.error(`THIS_JOB_ID_ALREADY_EXISTS`, 400);

        // lowercase all values
        req.body = functions.lowercaseAndValues(req.body)
        //Creating new job.
        jobId = await Model.JobPosting.create(req.body);

        // Send job creator an email stating that you have created a new job on the portal
        // let emailObj = {
        //     to: req.body.email,
        //     title: `You have been successfully registered`,
        //     message: `Hi user, You have been successfully registered with email : ${req.body.email}`,
        // };

        //Nodemailer service for sending email.
        // await Services.EmailService.sendEmail(emailObj);  // Configure this at last. More emails sent can disable the email account.
        return res.success("JOB_CREATED_SUCCESSFULLY", jobId);

    } catch (error) {
        next(error);
    }
}

module.exports.getAllJobPosts = async (req, res, next) => {
    try {

        let page = req.query.page ? Number(req.query.page) : 1;
        let count = req.query.count ? Number(req.query.count) : 10;
        let skipNo = Number((page - 1) * count);
        let sort = { jobId: -1 };
        let searchTerm = req.query.searchTerm

        let query = {
            isDeleted : false
        }
        // if(searchTerm) {
        //     $or = [
        //         query.title = new RegExp(searchTerm, 'i'),
        //         query.description = new RegExp(searchTerm, 'i'),
        //         query.requiredSkills = new RegExp(searchTerm, 'i'),
        //         query.experienceLevel = new RegExp(searchTerm, 'i'),
        //         query.email = new RegExp(searchTerm, 'i'),
        //         query.jobId = new RegExp(searchTerm, 'i')
        //     ]
        // }

        if(req.query.requiredSkills)
            query.requiredSkills = req.query.requiredSkills.toLowerCase()
        
        if(req.query.experienceLevel)
            query.experienceLevel = req.query.experienceLevel.toLowerCase()

        let active_key = {
            _id : 0,
            jobId : 1,
            title : 1,
            description : 1,
            requiredSkills : 1,
            experienceLevel : 1,
            email : 1
        }
        console.log('query-----', query)
        //Or we can write.
        // let active_key = 'email password accessToken';

        let doc = await Model.JobPosting.find(query).sort(sort).limit(count).skip(skipNo).select(active_key)
        const itemCount = await Model.JobPosting.find(query).countDocuments(query)
        let sendObj = { itemCount, doc };

        return res.success("JOB_DATA_FETCHED_SUCCESSFULLY", sendObj);

    } catch (error) {
        next(error);
    }
}

module.exports.getOneJobPost = async (req, res, next) => {
    try {
        let active_key = {
            _id : 0,
            title : 1,
            description : 1,
            requiredSkills : 1,
            experienceLevel : 1,
            email : 1
        }
        let doc = await Model.JobPosting.findOne({ jobId : req.params.jobId.toLowerCase(), isDeleted : false}).select(active_key)
        return res.success("JOB_DATA_FETCHED_SUCCESSFULLY", doc);

    } catch (error) {
        next(error);
    }
}

module.exports.deleteJobPost = async (req, res, next) => {
    try {
        
        const filter = { jobId: req.params.jobId.toLowerCase(), isDeleted : false };
        const update = req.body;
        const options = {
            new: true,
        };

        let doc = await Model.JobPosting.findOneAndUpdate(filter, update, options);
        if(!doc) return res.error('JOB_POSTING_ALREADY_DELETED', 400)

        return res.success("JOB_POSTING_DELETED_SUCCESSFULLY", doc);
    } catch (error) {
        next(error);
    }
}

module.exports.applyForNewJob = async (req, res, next) => {
    try {
        await Validation.JobPost.applyForNewJob.validateAsync(req.body);
        // lowercase all values
        req.body = functions.lowercaseAndValues(req.body)
        //Apply for job

        // first check if the job id is present in jobapplication schema
        /*
        if present append the applicants into the same schema
        else {
            create a new document for the job id
            then append users for the job id
        }
        */

        let jobIdDoc = await Model.JobApplication.findOne({jobId : req.body.jobId, isDeleted : false})
        if(!jobIdDoc) {
            // create a job Id in JobApplication schema
            let applicants = []
            applicants.push(req.body.email)
            let jobApplicationObj = {
                jobId : req.body.jobId,
                applicants
            }
            let jobApplicationDoc = await Model.JobApplication.create(jobApplicationObj)
            if(!jobApplicationDoc) return res.error(`ERROR_APPLYING_TO_JOB_WITH_ID:${req.body.jobId}`, 400)
            return res.success("JOB_APPLIED_SUCCESSFULLY", jobApplicationDoc);
        }
        else {
            // append the applicant with the job id in JobApplication schema
            jobIdDoc.applicants.push(req.body.email)
            await jobIdDoc.save()
            return res.success("JOB_APPLIED_SUCCESSFULLY", jobIdDoc);
        }

        // Send job applicant an email
        // let emailObj = {
        //     to: req.body.email,
        //     title: `You have been successfully registered`,
        //     message: `Hi user, You have successfully applied to the job with jobId : ${req.body.jobId}`,
        // };

        //Nodemailer service for sending email.
        // await Services.EmailService.sendEmail(emailObj);  // Configure this at last. More emails sent can disable the email account.

    } catch (error) {
        next(error);
    }
}

module.exports.viewAllJobApplicants = async (req, res, next) => {
    try {

        // lowercase all values
        let jobCreator = (req.params.jobCreator).toLowerCase()
        let jobId = (req.params.jobId).toLowerCase()

        let filter = {
            jobId,
            email : jobCreator,
            isDeleted : false
        }
        let check = await Model.JobPosting.findOne(filter)
        if(!check) return res.error('THE_JOB_POSTING_IS_NOT_OWNED_BY_THIS_USER', 400)

        let data = await Model.JobApplication.findOne({jobId})
        let applicantArray = []
        let n = data.applicants.length

        for(let i=0; i<n; i++){
            let userData = await Model.User.findOne({email : data.applicants[i], isDeleted : false})
            applicantArray.push(userData)
        }
        data.applicants = applicantArray
        await data.save()
        return res.success('ALL_JOB_APPLICANTS_FETCHED_SUCCESSFULLY', data)

    } catch (error) {
        next(error);
    }
}


