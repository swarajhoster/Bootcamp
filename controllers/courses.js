const Bootcamp = require("../models/Bootcamp")
const Course = require("../models/not")

const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async");

// @desc        GET all Courses
// @route       GET api/v1/courses
// @route       GET api/v1/bootcamps/:bootcampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {

    const {bootcampId} = req.params;
    let query = {};

    if (bootcampId) {
        query = Course.find({bootcamp: bootcampId})
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: "name description"
        })
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})


// @desc        GET Course based on ID
// @route       GET api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name description"
    })


    if (!course){
        return next(new ErrorResponse(`No course found with the id ${req.params.id}`), 404)
    }



    res.status(200).json({success: true, data: course})
})

// @desc        Add Course
// @route       POST api/v1/bootcamp/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp){
        return next(new ErrorResponse(`No Bootcamp found with the id ${req.params.bootcampId}`), 404)
    }

    const course = await Course.create(req.body)
    res.status(200).json({success: true, data: course})
})