import mongoose from 'mongoose';
import CartSchema from '@models/CartModel';

const CheckoutSchema = new mongoose.Schema({
  cart: {
    type: CartSchema,
    required: false,
  },

  payType: {
    type: String,
    required: false,
  },

  phoneNum: {
    type: Number,
    default: '',
    required: false,
  },
});

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

  // Schema for the items the user wishes to checkout
  checkout: {
    type: CheckoutSchema,
    required: false,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
