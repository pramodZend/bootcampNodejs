const mongoose = require('mongoose');
const slugify  = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        unique:false,
        maxlength:[50,"name should be maximum 50 characters"],
        trim:true
    },
    slug:String,
    description:{
        type:String,
        maxlength:[200,"description should be maximum 200 characters"],
    },
    website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,'Please use a valid URL with HTTP or HTTPS']
    },
    phone:{
        type:String,
        match: [/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,"Invalid phone number"],
    },
    email:{
        type:String,
        required:[true,"Please enter email id"],
        unique:true,
        match:[/.+\@.+\..+/,"invalid email"],
        trim:true
    },
    addess:{
        type:String,
        minlength:[50,"name should be minimum 50 characters"],
        true:true
    },
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
    careers:{
        type:[String],
        required:true,
        enum:['Web Development','Mobile Development','UI/UX','Data Science','Business','Other']
    },
    housing:{
        type:Boolean,
        default:true
    },
    jobAssistance:{
        type:Boolean,
        default:true
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
    
});

BootcampSchema.pre('save',function(next){
    console.log("slug name",this.name);
    this.slug   = slugify(this.name,{lower:true})
    next();
});


// Geocode & create location field
// BootcampSchema.pre('save', async function(next) {
//     const loc = await geocoder.geocode(this.address);
//     console.log(loc);
//     // this.location = {
//     //   type: 'Point',
//     //   coordinates: [loc[0].longitude, loc[0].latitude],
//     //   formattedAddress: loc[0].formattedAddress,
//     //   street: loc[0].streetName,
//     //   city: loc[0].city,
//     //   state: loc[0].stateCode,
//     //   zipcode: loc[0].zipcode,
//     //   country: loc[0].countryCode
//     // };
//     // Do not save address in DB
//     this.address = undefined;
//     next();
//   });
module.exports = mongoose.model("Bootcamp",BootcampSchema);