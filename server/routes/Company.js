const express = require('express');

const router = express.Router();
const {
    signup,
    sendEmailOtp,
    sendMobileOtp,
    verifyCrediantials,
    validateEmail,
    validatePhoneNo
} = require("../controllers/Auth")


router.post("/signup");
router.post("/verify-crediantials",verifyCrediantials);
router.post("/send-email-otp", sendEmailOtp);
router.post("/send-mobile-otp",sendMobileOtp);
router.post("/verify-email-otp",validateEmail);
router.post("/verify-phoneNo-otp",validatePhoneNo);
module.exports=router;