
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/Users');

exports.protect = asyncHandler(async(req,res,next)=>{
    let token;
    //console.log(req.headers);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new ErrorResponse('Token is invalid',401));
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);

        req.user    =   await User.findById(decode.id);
        next();

    } catch (error) {
        return next(new ErrorResponse('Token is invalid',401));
    }
    

});


//authorization method
exports.authorize = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`user role ${req.user.role} is not authorized to access this action`,403));
        }
        next();
    }   
}


