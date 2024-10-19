const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    phoneNo:{
        type:String,
        required:true,
    },
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true
    },
    employeeSize:{
        type:Number
    },
    password:{
        type:String,
        required:true
    },
    jobPostings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }
    ],

    }
)
module.exports=mongoose.model("Company",companySchema);