import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    homeAddress: {
        type: String,
        required: true,
    },

    contactNum: {
        type: Number,
        required: true,
    },

    altContactNum: {
        type: Number,
        required: false,
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
