const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt: {
		type:Date,
		default:Date.now
	},
});
const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
module.exports = JobPosting;
