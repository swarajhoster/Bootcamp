const Bootcamp = require("../models/Bootcamp")
const Course = require("../models/not")

const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async");

// @desc        Get all bootcamps
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
            path:'bootcamp',
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