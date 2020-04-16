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
    shared: [
      {
        type: Schema.Types.ObjectId,
        ref: 'resources',
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'resources',
      },
    ],
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
  },
  { timestamps: true },
);

const User = model('users', UserSchema);
module.exports = User;
