const Company = require("./models/Company")
const emailOtp = require("./models/EmailOtp");
const otpGenerator = require("otp-generator");
const phoneOtp = require("./models/PhoneOtp");
exports.sendEmailOtp = async (req, res) => {
    try{
        const {companyEmail} = req.body;
        const checkCompanyEmailPresent = await Company.findOne({companyEmail});
        if(checkCompanyEmailPresent){
            return res.status(401).json({
                sucess:false,
                message:"Company Email Already Exists",
            })
        }
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await emailOtp.findOne({ otp: otp }); 
        } while (result); 
        const otpPayload = {companyEmail, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("otpBODY -> ", otpBody);
        res.status(200).json({
            success:true,
            message:"OTP Sended SUCCESSFULLY !!",
        })

    } catch(error){
        console.log(error.message);
        return  res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
exports.sendMobileOtp = async(req,res)=>{
    try{
        const {phoneNo} = req.body;

        const checkExistingMobileNumber = phoneOtp.findOne({phoneNo});
        if(checkExistingMobileNumber){
            return res.status(401).json({
                sucess:false,
                message:"Company Phone Already Exists",
                })
            }
            do {
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                });
                result = await emailOtp.findOne({ otp: otp }); 
            } while (result); 
            const otpPayload = {companyEmail, otp};
            const otpBody = await OTP.create(otpPayload);
            console.log("otpBODY -> ", otpBody);
            res.status(200).json({
                success:true,
                message:"OTP Sended SUCCESSFULLY !!",
            })
        }catch(error){
            console.log(error.message);
            return  res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}
const generateJwtToken=(companyRecord)=>{
    const payload = {
        companyEmail: companyRecord.companyEmail,
        id: companyRecord._id
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {

    });
    return token;

}
exports.verifyCrediantials=async(req,res)=>{
    try{
        const{phoneNumber,companyEmail} = req.body();
        if(!phoneNumber || !companyEmail){
            return res.status(403).send({
			success: false,
			message: "All Fields are required",
            })
        }
        const companyRecord = await Company.findOne({ companyEmail });
        if(companyRecord){
            const registeredPhoneNumber = companyRecord.phoneNo;
            if (registeredPhoneNumber === phoneNumber) {
                const token = generateJwtToken(companyRecord);
                const options = {
                    expires: new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly:true,
                }
                res.cookie("token", token, options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"LOGGED IN SUCCESSFULLY",
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: "New phone number found with the registered email. Please verify both email and phone number."
                });
            } 
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No account found with the provided email."
            });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}
exports.signup = async (req, res) => {
	try {
        const {
            name,
			phoneNo,
            companyName,
            companyEmail,
			employeeSize,
        } = req.body;
        if (
			!name ||
			!phoneNo ||
			!companyName ||
			!employeeSize
        ) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
        const companyDetails = await Company.create({
			name,
            phoneNo,
            companyName,
            companyEmail,
            employeeSize
        });
        return res.status(200).json({
			success: true,
			user,
			message: "Company Details registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Company Details cannot be registered. Please try again.",
		});
	}
};
exports.validateEmail = async(req,res)=>{
    try{
        const {email,otp}=req.body;
        if(!email || !otp){
            res.status(403).json({
                success:false,
                message:"All Fields are Required"
            })
        }
        const response = await emailOtp.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
		if (response.length === 0) {
            return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
            return res.status(400).json({
				success: false,
				message: "The OTP you entered is wrong !!",
			});
		}else{
            return res.status(200).json({
                success:true,
                message:"Email OTP Validated Successfully"
            })
        }

    }catch(error){
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "Error Occured while Validating Email OTP",
		});

    }
}
exports.validatePhoneNo = async(req,res)=>{
    try{
        const {phoneNo,otp}=req.body;
        if(!phoneNo || !otp){
            res.status(403).json({
                success:false,
                message:"All Fields are Required"
            })
        }
        const response = await phoneOtp.find({ phoneNo }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
		if (response.length === 0) {
            return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
            return res.status(400).json({
				success: false,
				message: "The OTP you entered is wrong !!",
			});
		}else{
            return res.status(200).json({
                success:true,
                message:"PhoneNo OTP Validated Successfully"
            })
        }

    }catch(error){
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "Error Occured while Validating Phone OTP",
		});

    }
}




