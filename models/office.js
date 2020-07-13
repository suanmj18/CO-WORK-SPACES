var mongoose = require("mongoose");

//Scehma Setup
var officeSchema = new mongoose.Schema({
    name: String,
    address : String,
    price : String,
    image: String,
    description : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
           ref : "User"
            } ,
        username: String
     },
    comments : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

 module.exports = mongoose.model("Office",officeSchema);

 