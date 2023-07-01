const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/errorResponse");

// @description: get all bootcamps
// @route:/api/v1/bootcamps
// @access: public
exports.getALLBootcamps = asyncHandler(async(req,res,next)=>{

    console.log('req.query....',req.query);

    let query;

    const reqQuery = {...req.query};
    console.log('req.query.select.....',req.query.select);
    const removeFields = ['select'];

    //loop over removeFields and delete select
    removeFields.forEach(params=>delete reqQuery[params]);
    
    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));
    if(req.query.select){
        //console.log(req.query.select);
        const fields = req.query.select.split(',').join(' ');
        //console.log(fields);
        query = query.select(fields);
    }
    if(req.query.sort){
        const SortBy = req.query.sort.split(',').join(' ');
        console.log('sortby',SortBy);
        query = query.sort(SortBy);
     }else{
         query = query.sort('-createdAt');
     }

    const bootcamps  = await query;

    res.status(200).json({success:true,data:bootcamps});  
});

// @description: get bootcamp
// @route:/api/v1/bootcamps
// @access: public
exports.getBootcamp = asyncHandler(async(req,res,next)=>{

    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamps not found for the id ${req.params.id}`,404))
    }
    res.status(200).json({success:true,data:bootcamp});
});

// @description: created bootcamps
// @route:/api/v1/bootcamps
// @access: private
exports.createBootcamps = asyncHandler(async(req,res,next)=>{

    req.body.user = req.user.id;
    const publisher = await Bootcamp.findOne({user:req.user.id});
    console.log('publisher',publisher);
    if(publisher && req.user.role !== 'admin'){
        return next(new ErrorResponse(`user ${req.user.id} role ${req.user.role} is already published bootcamp`,404));
    }
   
    const bootcamp = await Bootcamp.create(req.body);
    res
    .status(201) 
    .json({success:true,data:bootcamp});
});

// @description: update bootcamps
// @route:/api/v1/bootcamps/:id
// @access: private
exports.updateBootcamps = asyncHandler(async(req,res,next)=>{

    let updateBootcamp = await Bootcamp.findById(req.params.id);
  // console.log(">>>>>>>",updateBootcamp.user,req.user.id);return;
    if(!updateBootcamp){
        return next(new ErrorResponse(`Bootcamps not found for the id ${req.params.id}`,404))
    }
    
    if(updateBootcamp.user.toString() !==req.user.id && req.user.role !=='admin'){
        return next(new ErrorResponse(`user role ${req.user.id} is not owner to update Bootcamp`,404))
    }

    updateBootcamp = await Bootcamp.findOneAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

  
    res.status(200).json({ success:true,data:updateBootcamp});
    // res.status(200).json({success:true,msg:`display bootcamps ${req.params.id}`});
});

// @description: delete bootcamps
// @route:/api/v1/bootcamps/:id
// @access: private
exports.deleteBootcamps = asyncHandler(async(req,res,next)=>{
    
    let bootcamp = await Bootcamp.findById(req.params.id);
    console.log("bootcamp>>>>>>>>>>>>>>",bootcamp);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found for the id ${req.params.id}`,404))
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`${req.user.id} is not owner to delete this bootcamp`,404))
    }

    //bootcamp = await Bootcamp.deleteOne(req.params.id);
    bootcamp.deleteOne();
    
    res.status(200).json({success:true,data:{}});
});

