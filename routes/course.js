const express = require('express');

const {getCourses,createCourse,deleteCourses,updateCourse}  = require('../controllers/Course');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth'); 

console.log("routesdddddddddddddd");
router
.route('/')
.get(getCourses)
.post(createCourse)

 router
 .route('/:id')
// .get(getBootcamp)
 .put(updateCourse)
 .delete(deleteCourses)


module.exports = router;

