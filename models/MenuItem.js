const mongoose = require('mongoose');

const MenuItem = new mongoose.Schema({
    itemName:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },

    itemImgURL:{
        type: String,
        default: "none",
        required: false,
    }
});

const MenuItem = mongoose.model('MenuItem', MenuItem);
module.exports = MenuItem;