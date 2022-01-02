import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const ImageSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: false,
  },
});

// Schema is modelled after the content model from the Contentful headless CMS
const MenuItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: false,
  },

  category: {
    type: String,
    required: false,
  },

  description: {
    type: String,
    required: false,
  },

  price: {
    type: Double,
    required: false,
  },

  isAvailable: {
    type: Boolean,
    required: false,
  },

  // Array of images (in case there are multiple images)
  imgUrls: [ImageSchema],
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
    type: String,
    required: true,
  },

  altContactNum: {
    type: String,
    required: false,
  },

  cart: { type: [CartItemSchema], required: false, default: [] },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
