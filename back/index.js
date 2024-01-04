const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./Routes/routes")
var uri = "mongodb://localhost:27017/angularauth"
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err))

app = express()

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: "http://localhost:4200"
}));

app.use('/api', router)



app.listen(8000, () => {
    console.log("Server is running on port 8000")
})