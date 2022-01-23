import mongoose from "mongoose";
import Double from "@mongoosejs/double";

const MenuItemSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: true,
	},

	productPrice: {
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
	invoiceNum: {
		type: Number,
		required: true,
	},

	dateCreated: {
		type: Date,
		required: true,
	},

	orderStatus: {
		type: Number,
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
		type: Array,
		required: true,
	},

	order: {
		type: [CartItemSchema],
		required: true,
	},

	specialInstructions: {
		type: String,
		required: false,
	},

	reasonForCancel: {
		type: String,
		required: false,
		default: "",
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

	// If GCash is selected as pay method
	proofPayment: {
		type: image,
		required: false,
	},

	change: {
		type: Number,
		required: false,
	},

	deliverTime: {
		type: String,
		required: false,
	},

	// FOR PICKUP
	storeLocation: {
		type: String,
		required: false,
	},

	pickupTime: {
		type: String,
		required: false,
	},
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
