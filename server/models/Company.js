const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    phoneNo:{
        type:Number,
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
    }

    }
)
module.exports=mongoose.model("Company",companySchema);