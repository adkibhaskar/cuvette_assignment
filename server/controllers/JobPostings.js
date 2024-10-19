const JobPosting=require("../models/JobPosting");
const Company = require("../models/Company"); 
exports.createJobPost=async(req,res)=>{
try{
    let{jobTitle,jobDescription,experienceLevel,endDate,status}=req.body;
    const companyId = req.company.id;
    if(!jobTitle ||
        !jobDescription ||
        !experienceLevel ||
        !endDate ||
        !status
    ){
        return res.status(400).json({
            success: false,
            message: "All Fields are Mandatory",
        })
    }
    if (!status || status === undefined) {
        status = "Draft"
      }
      const newJobPosting = await JobPosting.create({
        jobTitle,
        jobDescription,
        endDate,
        experienceLevel,
        endDate,
        status
    })
    await Company.findByIdAndUpdate(
        {
          _id: companyId,
        },
        {
          $push: {
            jobPostings : newJobPosting._id,
          },
        },
        { new: true }
      )
      res.status(200).json({
        success: true,
        data: newJobPosting,
        message: "Job Posting Created Successfully",
      })

}catch(error){
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
}
}

exports.getAllOpenJobPostings = async (req, res) => {
    try {
        const currentDate=new Date();
        const allJobPostings = await JobPosting.find(
        { 
            status: "Published",
            endDate:{$gte:currentDate}
        },
        {
          jobTitle: true,
          jobDescription: true,
          experienceLevel: true,
          endDate: true,
        }
      )
      return res.status(200).json({
        success: true,
        data: allJobPostings,
      })
    } catch (error) {
      console.log(error)
      return res.status(404).json({
        success: false,
        message: `Can't Fetch JobPosting Data`,
        error: error.message,
      })
    }
  }
  exports.getAllCompletedJobPostings=async(req,res)=>{
    try{
        const currentDate = new Date();
        const allJobPostings = await JobPosting.find(
            {
                status:"Published",
                endDate:{$lt:currentDate}
            },
            {
                jobTitle:true,
                jobDescription:true,
                experienceLevel:true,
                endDate:true
            }
        )
        return res.status(200).json({
            success: true,
            data: allJobPostings,
          })

    }catch(error){
        console.log(error)
       return res.status(404).json({
        success: false,
        message: `Can't Fetch JobPosting Data`,
        error: error.message,
      })

    }
  }