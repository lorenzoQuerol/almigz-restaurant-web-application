import mongoose from "mongoose";
import CartSchema from "@models/CartModel";
import UserSchema from "@models/UserModel";

const CheckoutSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },

    // Delivery or Pickup
    type: {
        type: String,
        required: false,
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

const User = mongoose.model("User", UserSchema);
export default mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
