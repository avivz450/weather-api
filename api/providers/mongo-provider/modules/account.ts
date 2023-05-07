import { Account } from '../../../modules/account';
import { EmailUtility } from '../../../utils/email-utility';
const mongoose = require('mongoose');

const account_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'MISSING_ACCOUNT_NAME'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'MISSING_ACCOUNT_EMAIL'],
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
    }
  },
  {
    timestamps: true,
  },
);

export const AccountMongoose = mongoose.model('Account', account_schema);
