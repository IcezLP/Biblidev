const { Schema, model } = require('mongoose');

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    plural_name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 35,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 35,
    },
  },
  { timestamps: true },
);

const Category = model('categories', CategorySchema);
module.exports = Category;
