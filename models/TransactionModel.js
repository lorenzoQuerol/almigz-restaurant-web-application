import mongoose from "mongoose";
import Double from "@mongoosejs/double";

MenuItemSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: false,
	},

	price: {
		type: Double,
		required: false,
	},
});

const CartItemSchema = new mongoose.Schema({
	quantity: {
		type: Number,
		required: false,
	},

	menuItem: {
		type: MenuItemSchema,
		required: false,
	},
});

const TransactionSchema = new mongoose.Schema({
	// DELIVERY or PICKUP
	type: {
		type: String,
		required: false,
	},

	// BASIC DETAILS
	fullName: {
		type: String,
		required: true,
	},

	contactNum: {
		type: String,
		required: true,
	},

	order: {
		type: [CartItemSchema],
		required: true,
		default: [],
	},

	totalPrice: {
		type: Double,
		required: true,
	},

	// FOR DELIVERY
	email: {
		type: String,
		required: false,
		default: "",
	},

	address: {
		type: String,
		required: false,
		default: "",
	},

	payMethod: {
		type: String,
		required: false,
	},

	change: {
		type: String,
		required: false,
	},

	deliverType: {
		type: String,
		required: false,
		default: "NOW",
	},

	// FOR PICKUP
	storeLocation: {
		type: String,
		required: false,
	},

	pickupType: {
		type: String,
		required: false,
		default: "NOW",
	},
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
