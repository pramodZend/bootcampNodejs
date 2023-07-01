const ErrorResponse = require("../utils/errorResponse");

const ErrorHandler  = (err, req, res, next)=> {
    //return next(err)
    let error = {...err};
    error.message = err.message;

     console.log(err.stack.red);
     console.log(err);   
    // console.log(err.errors);

     if(err.name === 'CastError'){
         const message = `Bootcamp not found for the id ${err.value}`;
         error = new ErrorResponse(message,404);
     }
     //mongoose validation error
     if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val=>val.message)
        error = new ErrorResponse(message,400);
     }
     if(err.code === 11000){
        const message = 'duplicate fields not allowed';
        error = new ErrorResponse(message,400);
     }

     console.log("Errorsssssssssssssssssssssss>>>>>>",error.statusCode)

    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || 'server error'
    });
}

module.exports = ErrorHandler;