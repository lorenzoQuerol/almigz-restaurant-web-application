import mongoose from "mongoose";

// Model used for GCash proof of payments
const ImageSchema = new mongoose.Schema({
	caption: {
		required: true,
		type: String,
	},

	filename: {
		required: true,
		type: String,
	},

	fileId: {
		required: true,
		type: String,
	},

	createdAt: {
		default: Date.now(),
		type: Date,
	},
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
