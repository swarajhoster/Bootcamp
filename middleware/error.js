const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {

    let error = {...err}
    error.message = err.message

    // Logging the Error During Development
    if (process.env.NODE_ENV === "development") {
        // console.log(err)
    }

    // Mongoose bad ObjectID Error
    if (err.name === "CastError") {
        const message = `Resource not found with this id ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate field value entered`
        error = new ErrorResponse(message, 400)
    }
    // Mongoose Validate Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    // Sending the Error
    res.status(error.statusCode || 500).json({
        success: true,
        error: error.message || 'Server-side Error'
    })
}


module.exports = errorHandler