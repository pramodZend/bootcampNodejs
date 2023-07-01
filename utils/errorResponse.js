class errorResponse extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode;
       // console.log("statuscode",this.statusCode)
        //Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = errorResponse;
    