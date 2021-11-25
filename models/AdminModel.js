import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
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

  altEmail: {
    type: String,
    required: false,
  },

  password: {
    type: String,
    required: true,
  },

  // Boolean value to check if this admin account is deletable
  isDelete: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
