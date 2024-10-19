const express = require("express");
const router=express.Router();
const { auth} = require("../middlewares/auth")

const{
    createJobPost,
    getAllOpenJobPostings,
    getAllCompletedJobPostings
}=require("../controllers/JobPostings");

router.post("/create-job-post",auth,createJobPost);
router.get("/get-all-open-post",auth,getAllOpenJobPostings);
router.get("/get-all-completed-post",auth,getAllCompletedJobPostings);
module.exports=router;