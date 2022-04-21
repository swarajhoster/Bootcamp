const mongoose = require("mongoose")

const connectDB = async () => {
    mongoose.connect("mongodb://localhost:27017/devcamper", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology:true
    }).then((p) => {
        console.log(`MongoDb connect to: ${p.connection.host}`.yellow.bold)
    }).catch((err) => {
        console.log(err.red)
    })
}

module.exports = connectDB;