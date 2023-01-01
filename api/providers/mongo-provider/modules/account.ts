import { EmailUtility } from '../../../utils/email-utility';
const mongoose = require('mongoose');

const account_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!EmailUtility.isValidEmail(value)) {
          throw new Error('INVALID_EMAIL');
        }
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const AccountMongoose = mongoose.model('Account', account_schema);
