const express = require("express")
const router = express.Router()

const {
    getBootcamps,
    createBootcamp,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require("../controllers/bootcamps")

// Include other resources routers
const courseRouter = require("./courses")

// Re-route into other resources routers
router.use('/:bootcampId/courses', courseRouter)

// Get Bootcamp based on there location
router.get("/radius/:zipcode/:distance", getBootcampsInRadius)

// Get All Bootcamp
router.get('/', getBootcamps)

// Create Bootcamp
router.post('/', createBootcamp)

// Get Single Bootcamp
router.get('/:id', getBootcamp)

// Update Bootcamp
router.put('/:id', updateBootcamp)

// Delete Bootcamp
router.delete('/:id', deleteBootcamp)

module.exports = router