const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
    cart:[{ //Cart item object
        qty:{
            type: Number,
            required: true
        },
        
        //Is this possible
        cartItem:{
            type: MenuItem,
            required: true
        }
    }],
});

const CartItem = mongoose.model('CartItem', CartItem);
module.exports = CartItem;