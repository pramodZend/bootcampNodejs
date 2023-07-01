
const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const CourseSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,'title is required'],
        unique:true
    },
    description:{
        type:String,
        require:[true,'enter description'],
        minlength:[20,'min length should be 20']
    },
    weeks: {
        type:Number,
        minlength:[6,'minimum length should be 6'],
        maxlength:[20,'maximum length should be 20']
    },
    tuition: {
        type:Number,
        min:10000,
        max:50000
    },
    minimumSkill:{
        type:String,
        enum:['beginner','intermediate','expert'],
        default:'beginner'
    },
    "scholarshipsAvailable":{
        type:Boolean,
        default:true
    } ,
    bootcamp: {
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user: {
       type:mongoose.Schema.ObjectId,
       ref:'User',
       required:true
    }
})

module.exports = mongoose.model('Course',CourseSchema);