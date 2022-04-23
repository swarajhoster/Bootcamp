const express = require("express")
const router = express.Router({mergeParams: true})

const {getCourses, getCourse} = require("../controllers/courses.js")

router.get('/', getCourses)
router.get('/:id', getCourse)

module.exports = router;

