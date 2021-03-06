const Bootcamp = require("../models/Bootcamp")

const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc        Get all bootcamps
// @route       GET api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query}

    // fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    // Loop over the query, to remove fields, from the array
    removeFields.forEach(param => delete reqQuery[param])

    // Create Query to String
    let queryStr = JSON.stringify(reqQuery)

    // Add $ to operators, to make them valid mongoose operator
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Find Resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate("courses")

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort("-createdAt")
    }


    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit)

    // Executing Query
    const bootcamps = await query;

    // Pagination Result
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    return res.status(200).json({success: true, count: bootcamps.length, pagination, data: bootcamps})
})


// @desc        Get Single bootcamp based on ID
// @route       GET api/v1/bootcamp/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with is of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: bootcamp})

})

// @desc        Create new bootcamps
// @route       POST api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({success: true, data: bootcamp})

})


// @desc        Update bootcamp based on ID
// @route       PUT api/v1/bootcamp/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with is of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp})

    } catch (err) {
        next(err)
    }
})


// @desc        DELETE bootcamp based on ID
// @route       DELETE api/v1/bootcamp/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with is of ${req.params.id}`, 404))
        }
        await bootcamp.remove()
        res.status(200).json({success: true, message: `Bootcamp Deleted with the id: ${req.params.id}`})

    } catch (err) {
        next(err)
    }
})

// @desc        Get bootcamp based on radius
// @route       GET api/v1/bootcamp/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    const {zipcode, distance} = req.params;

    // Get lat/lng
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calculate Radius
    // Divide dist by radius on Earth
    // Earth Radius = 3,963 mi / 6,378km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    })

    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})

})
