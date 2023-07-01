const express = require('express');

const {getALLBootcamps,getBootcamp,createBootcamps,updateBootcamps,deleteBootcamps}  = require('../controllers/bootcamps');

const router  = express.Router();

const { protect,authorize } = require('../middleware/auth'); 

const CourseRouter = require('./course')

router.use('/:bootcampId/createCourse',protect,CourseRouter);
router.use('/:bootcampId/courses',protect,CourseRouter);

router
.route('/')
.get(getALLBootcamps)
.post(protect,createBootcamps)

router
.route('/:id')
.get(getBootcamp)
.put(protect,updateBootcamps)
.delete(protect,deleteBootcamps)


module.exports = router;


