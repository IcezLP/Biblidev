const { Schema, model } = require('mongoose');

const ResourceSchema = new Schema(
  {
    logo: String,
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 24,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 24,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'categories',
      },
    ],
    link: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      enum: ['gratuit', 'gratuit-et-payant', 'payant'],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    state: {
      type: String,
      enum: ['Validée', 'En attente de validation'],
      required: true,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  { timestamps: true },
);

const Resource = model('resources', ResourceSchema);
module.exports = Resource;
