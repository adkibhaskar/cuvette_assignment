const mongoose = require('mongoose');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken); 

const phoneOtpSchema = new mongoose.Schema({
    phoneNo:{
        type:Number,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})
async function sendOtpToPhone(phoneNumber, otp) {
    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            to: phoneNumber,
            from: 'your_twilio_phone_number' 
        });
        console.log("OTP sent successfully:", message.sid);
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
}

phoneOtpSchema.pre("save",async function(next){
    if(this.isNew){
        await sendOtpToPhone(this.phoneNo,this.otp);
    }
})
module.exports = mongoose.model("phoneOtp",phoneOtpSchema);