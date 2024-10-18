const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const emailOtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
    }
})

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email,
             "Verification EMAIL from StudyNotion by-Bhaskar",
             emailTemplate(otp));
        console.log("Email sended Successfully!! => ", mailResponse);
    } catch(error) {
        console.log("error while SENDING.. EMAIL", error);
        throw error;
    }
}


OTPSchema.pre("save", async function(next) {
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
})

const emailOtp = mongoose.model("emailOtp",emailOtpSchema);
module.exports = emailOtp;