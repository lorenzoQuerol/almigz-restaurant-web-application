const mongoose = require('mongoose');

const Admin = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    email2:{
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    isDelete: { //bool val to check if this admin account is deletable
        type: Boolean,
        default:true
    }
});

const Admin = mongoose.model('Admin', Admin);
module.exports = Admin;