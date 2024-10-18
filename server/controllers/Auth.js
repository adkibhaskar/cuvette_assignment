const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const emailOtp = require("../models/EmailOtp");
const phoneOtp = require("../models/PhoneOtp");
const Company = require("../models/Company");
exports.sendEmailOtp = async (req, res) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(403).send({
                success: false,
				message: "All Fields are required",
			});
        }
        const checkCompanyEmailPresent = await Company.findOne({companyEmail:email});
        if(checkCompanyEmailPresent){
            return res.status(401).json({
                sucess:false,
                message:"Company Email Already Exists",
            })
        }
        let otp;
        let result;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            console.log("The otp is : ",otp);
            result = await emailOtp.findOne({ otp });
        } while (result); 
        const otpPayload = {email, otp};
        const otpBody = await emailOtp.create(otpPayload);
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
        if(!phoneNo){
            return res.status(403).send({
                success: false,
				message: "All Fields are required",
			});
        }
        const checkExistingMobileNumber = await Company.findOne({phoneNo:phoneNo});
        if(checkExistingMobileNumber){
            return res.status(401).json({
                sucess:false,
                message:"Company Phone Already Exists",
                })
            }
            let otp;
            let result;
            do {
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    lowerCaseAlphabets: false,
                    digits: true      
                });
                result = await emailOtp.findOne({ otp: otp }); 
            } while (result); 
            const otpPayload = {phoneNo, otp};
            const otpBody = await phoneOtp.create(otpPayload);
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
exports.signup = async (req, res) => {
	try {
        const {
            name,
			phoneNo,
            companyName,
            companyEmail,
			employeeSize,
            password,
            confirmPassword
        } = req.body;
        if (
			!name ||
			!phoneNo ||
			!companyName ||
			!employeeSize ||
            !password ||
            !confirmPassword
        ) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
        if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}
        const existingCompany = await Company.findOne({ companyEmail });
		if (existingCompany) {
			return res.status(400).json({
				success: false,
				message: "Company  already exists. Please sign in to continue.",
			});
		}
        const hashedPassword = await bcrypt.hash(password, 10);
        const companyDetails = await Company.create({
			name,
            phoneNo,
            companyName,
            companyEmail,
            employeeSize,
            password: hashedPassword,
        });
        return res.status(200).json({
			success: true,
			companyDetails,
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
exports.login = async (req, res) => {
    try{
        const{
            companyEmail,
            password,
        } = req.body;

        
        if( !companyEmail || !password ){
            return res.status(403).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED",
            });
        }

        //checking... user existence
        const companyDetails = await Company.findOne({companyEmail})
        if(!companyDetails){
            return res.status(401).json({
                success:false,
                message:"Company is not registered !!",
            });
        }
        if(await bcrypt.compare(password, companyDetails.password)) {
            const payload = {
                email: companyDetails.companyEmail,
                id: companyDetails._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {});
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                message:"LOGGED IN SUCCESSFULLY",
            });
        
        }
        else{
            return res.status(401).json({
                success:false,
                message:"password doesnt matched !!",
            });
        }

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user cannot LOGGED in, try again ",
        }) 
    }
} 
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




