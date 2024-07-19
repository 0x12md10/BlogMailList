const { default: mongoose } = require("mongoose");


const UserSchema = new mongoose.Schema({

    email : {
        type : String,
        required : true
    },
    origin : {
        type : String
    },
    userAgent : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    }

})

const MailList = mongoose.model("MailList" ,UserSchema );

module.exports = MailList