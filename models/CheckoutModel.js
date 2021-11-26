import mongoose from "mongoose";
import CartSchema from "@models/CartModel";

const CheckoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    // Delivery or Pickup
    type: {
        type: String,
        required: true,
    },

    // Gcash or COD
    payMethod: {
        type: String,
        required: false,
    },

    cart: {
        type: CartSchema,
        required: false,
    },
});

export default mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
