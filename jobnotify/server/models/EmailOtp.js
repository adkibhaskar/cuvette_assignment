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
             "Verification EMAIL from Cuvette by-Bhaskar",
             emailTemplate(otp));
        console.log("Email sended Successfully!! => ", mailResponse);
    } catch(error) {
        console.log("error while SENDING.. EMAIL", error);
        throw error;
    }
}


emailOtpSchema.pre("save", async function(next) {
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
})
module.exports = mongoose.model("emailOtp",emailOtpSchema);