const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
    cart:[{ //Cart item object
        qty:{
            type: Number,
            required: true
        },
        
        //The menu Item that was chosen
        menuItem:{
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
            },
        }
    }],
});

const CartItem = mongoose.model('CartItem', CartItem);
module.exports = CartItem;