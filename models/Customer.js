const mongoose = require('mongoose');

const Customer = new mongoose.Schema({
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

    password: {
        type: String,
        required: true
    },

    homeAddr: {
        type: String,
        required: true
    },

    contactNum1:{
        type: Number,
        required: true
    },
    contactNum1:{
        type: Number,
        required: false
    },
    
    checkout:{ //schema for the items the user wishes to checkout
        checkoutCart: {
            type: CartItem,
            required: false
        },
        payMethod:{ //payment information object
            payType:{
                type: String,
                required: false
            },
    
            payPhoneNum:{ //payment phone number if GCASH
                type: Number,
                default: "",
                required: false
            },
        }
    }

});

const Customer = mongoose.model('Customer', Customer);
module.exports = Customer;