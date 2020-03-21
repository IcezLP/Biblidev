const { Schema, model } = require('mongoose');

const TokenSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['emailValidation', 'passwordReset'],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

TokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const Token = model('tokens', TokenSchema);
module.exports = Token;
