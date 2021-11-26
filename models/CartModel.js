import mongoose from "mongoose";
import MenuSchema from "@models/MenuModel";

const CartItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },

    menuItem: {
        type: MenuSchema,
        required: true,
    },
});

const CartSchema = new mongoose.Schema({
    cart: [CartItemSchema],
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
