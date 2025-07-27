// models/userAccess.js

import mongoose from 'mongoose';
import validator from 'validator';

const UserAccessSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID',
      },
      lowercase: true,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserAccess = mongoose.model('UserAccess', UserAccessSchema);
export default UserAccess;
