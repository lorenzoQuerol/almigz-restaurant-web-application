import mongoose from "mongoose";
import Double from "@mongoosejs/double";

const MenuItemSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: true,
	},

	price: {
		type: Double,
		required: true,
	},
});

const CartItemSchema = new mongoose.Schema({
	quantity: {
		type: Number,
		required: true,
	},

	menuItem: {
		type: MenuItemSchema,
		required: true,
	},
});

const TransactionSchema = new mongoose.Schema({
	orderStatus: {
		type: String,
		required: true,
	},

	// DELIVERY or PICKUP
	type: {
		type: String,
		required: true,
	},

	// BASIC DETAILS
	fullName: {
		type: String,
		required: true,
	},

	email: {
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
	},

	totalPrice: {
		type: Double,
		required: true,
	},

	// FOR DELIVERY
	address: {
		type: String,
		required: false,
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
	},

	// FOR PICKUP
	storeLocation: {
		type: String,
		required: false,
	},

	pickupType: {
		type: String,
		required: false,
	},
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
