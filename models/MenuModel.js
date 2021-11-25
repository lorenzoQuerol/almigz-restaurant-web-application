import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const ImageSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    default: 'none',
    required: false,
  },
});

// Schema is modelled after the content model from the Contentful headless CMS
const MenuSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  // Array of images (in case there are multiple images)
  imgUrls: [ImageSchema],

  price: {
    type: Double,
    required: true,
  },

  isAvailable: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
