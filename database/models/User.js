const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    avatar: String,
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 4,
      maxlength: 20,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      minlength: 4,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    suspended: {
      amount: {
        type: Number,
        default: 0,
      },
      until: Date,
    },
  },
  { timestamps: true },
);

const User = model('users', UserSchema);
module.exports = User;
