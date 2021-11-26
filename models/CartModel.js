import mongoose from "mongoose";
import MenuSchema from "@models/MenuModel";
import UserSchema from "@models/UserModel";

const CartItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: false,
    },

    menuItem: {
        type: MenuSchema,
        required: false,
    },
});

const CartSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: User,
    },

    cart: [CartItemSchema],
});

const User = mongoose.model("User", UserSchema);
export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
