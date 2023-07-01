const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @description: get all courses
// @route:/api/v1/courses
// @access: public
exports.getCourses = asyncHandler(async(req,res,next)=>{

    let query;

   if(req.params.bootcampId){
        query =  Course.find({bootcamp:req.params.bootCampId})
       // console.log('req.query....',query);
   }else{
        query = Course.find();
   }
    const courses  = await query;
   console.log(courses);
    res.status(200).json({success:true,data:courses});  
});


// @description: created course
// @route:/api/v1/bootcamps/:bootcampId/createCourse
// @access: private
exports.createCourse = asyncHandler(async(req,res,next)=>{
    //console.log(">>>>>>>>",req);
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp found for ${req.params.bootcampId}`,404));
    }
    console.log('bootcamp',bootcamp);
    
    if(bootcamp.user.toString() !==req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`user ${req.user.id} is not authorized to add a course to bootcamp`,404));
    }
   
    const course = await Course.create(req.body);
    res.status(201).json({success:true,data:course});


});


// @description: delete courses
// @route:/api/v1/courses/:id
// @access: private
exports.deleteCourses = asyncHandler(async(req,res,next)=>{
    
    let course = await Course.findById(req.params.id);
    console.log('courses',course);
    if(!course){
        return next(new ErrorResponse(`Course not found for the id ${req.params.id}`,404))
    }

    // if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    //     return next(new ErrorResponse(`${req.user.id} is not owner to delete this course`,404))
    // }

  //  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    await course.deleteOne();
    
    res.status(200).json({success:true,data:{}});
});


// @description: update course
// @route:/api/v1/courses/:courseId
// @access: private
exports.updateCourse = asyncHandler(async(req,res,next)=>{
    console.log(">>>>>>>>",req.params);
    // req.body.bootcamp = req.params.courseId;

    // req.body.user = req.user.id;

    let course = await Course.findById(req.params.id);
    
    if(!course){
        return next(new ErrorResponse(`No course found for ${req.params.courseId}`,404));
    }
    console.log('bootcamp',course);
    
    // if(course.user.toString() !==req.user.id && req.user.role !== 'admin'){
    //     return next(new ErrorResponse(`user ${req.user.id} is not authorized to add a course to bootcamp`,404));
    // }
   
    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(201).json({success:true,data:course});


});

