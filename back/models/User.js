const  Mongoose  = require("mongoose");

const userSchema = new Mongoose.Schema({
    email: String,
    password: String,
    name: String
})

module.exports = Mongoose.model("User", userSchema)