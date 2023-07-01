
const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/Users");
const sendEmail = require('../utils/sendEmails');
const crypto = require('crypto');

exports.register = asyncHandler(async(req,res,next)=>{

    const {name,email,password,role}  = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user,200,res);

});

//Login account
exports.login = asyncHandler(async(req,res,next)=>{

    const {email,password}  = req.body;
    if(!email || !password){
        return next(new ErrorResponse("Please enter email and password",400));
    }
    
    let user = await User.findOne({email}).select('+password');
    
    if(!user){
        return next(new ErrorResponse('invalid email',401));
    }
   // console.log(password);
    const isMatch = await user.IsMatchedPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid password',401));
    }

    //const token = user.getSignedJwtToken();
    //res.status(200).json({success:true,token});

    sendTokenResponse(user,200,res);

});

const sendTokenResponse = (user,statuscode,res)=>{

    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        token
    });

};



//Login account
exports.getMe = asyncHandler(async(req,res,next)=>{
    console.log(req.user);
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorResponse('Invalid user id',401));
    }
    res.status(200).json({
        success:true,
        data:user
    })

});

//@desc:  forgot password 
//@route: post api/v1/auth/forgotPassword
//@access: public
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
    
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorResponse('Invalid user id',401));
    }
    //Get Reset Token
    const resetToken = user.getResetPasswordToken();

    console.log('resetPasswordToken',resetToken);

    const resetUrl = `${req.protocol} ://${req.get('host')}/api/v1/auth/resetPassword?token=${resetToken}`;
    
    await user.save({validateBeforeSave:false});

    const message = `you are receiving a message due to you forgot password, please reset password using below link \n\m ${resetUrl}`;

    try {
        await sendEmail({
            email:user.email,
            subject:'Forgot Password',
            message:message
        })
        res.status(200).json({
            success:true,
            data:'Email Sent'
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorResponse(`Sorry Email can not be sent`,500));
    }
});


//Login account
exports.resetPassword = asyncHandler(async(req,res,next)=>{
    
    console.log(">>>>>>>>>>>",req.params);
    console.log(">>>>>>>>>>>",req.body);
    
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    console.log(">>>>>>>>>>>",resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken
       // resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorResponse('Invalid token',400));
    }
    res.status(200).json({
        success:true,
        data:user
    });

});