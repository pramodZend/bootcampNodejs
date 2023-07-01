const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter name"]
    },
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        match:[/.+\@.+\..+/,"invalid email"],
        trim:true
    },
    role:{
        type:String,
        enum:['user','publisher','admin'],
        default:"user"
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        minlength:6,
        trim:true,
        select:false
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


UserSchema.pre('save',async function(next){
    
    if(!this.isModified('password')){
        next();
    }
    const salt =  await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
    console.log(this.password);
});

UserSchema.methods.getSignedJwtToken = function(){
    // return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    //     expiresIn:process.env.JWT_EXPIRE
    // });
    console.log("hereee");
};

UserSchema.methods.getSignedJwtToken = function () {

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
};

UserSchema.methods.IsMatchedPassword = async function(password){
    return await bcryptjs.compare(password,this.password)
};

UserSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 *1000;
    return resetToken;
}

module.exports = mongoose.model("Users",UserSchema);