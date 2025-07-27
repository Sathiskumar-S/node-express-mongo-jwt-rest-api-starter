// models/user.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoosePaginate from 'mongoose-paginate-v2';

const SALT_FACTOR = 5;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID',
      },
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    verification: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    urlTwitter: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v);
        },
        message: 'NOT_A_VALID_URL',
      },
      lowercase: true,
    },
    urlGitHub: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v);
        },
        message: 'NOT_A_VALID_URL',
      },
      lowercase: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    const hash = bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (passwordAttempt) {
  // return await bcrypt.compare(passwordAttempt, this.password);
  //TODO: check password hash compare after using hash
  return await passwordAttempt === this.password;
};

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);
export default User;
