const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")

const connectDB = require("./config/db.js")
const errorHandler = require("./middleware/error.js")

const app = express()

// Load env vars
dotenv.config({path: "./config/config.env"})

// MongoDb connection
connectDB();

// Body parser
app.use(express.json())

// Route Files
const bootcamps = require("./routes/bootcamps.js")

// Mount routers
app.use("/api/v1/bootcamps", bootcamps)

// Custom Errorhandler
app.use(errorHandler)

//Dev logging requests
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// App Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.yellow.bold)
})