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
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  {
    timestamps: true,
  },
);

account_schema.pre("findOneAndUpdate", function(next){
    this._update = Object.keys(this._update).reduce(
        (accumulator, key) => {
            if(Account.updateable_fields.includes(key)){
                accumulator[key] = this._update[key];
            }
            return accumulator;
        },
        {}
    )
    
    next();
})

export const AccountMongoose = mongoose.model('Account', account_schema);
