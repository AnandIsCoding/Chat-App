import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'Name should contain a minimum of 3 characters'],
    maxlength: [25, 'Name cannot contain more than 25 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password should contain at least 8 characters'],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  bio: {
    type: String,
    required: true,
    minlength: [5, 'Bio should contain a minimum of 5 characters'],
    maxlength: [50, 'Bio cannot contain more than 50 characters'],
  },
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;
