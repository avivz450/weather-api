import { Account } from '../../../modules/account.js';
import { EmailUtility } from '../../../utils/email-utility.js';
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
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
            validate: {
                validator: (value: string) => EmailUtility.isValidEmail(value),
                message: 'INVALID_EMAIL',
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const AccountMongoose = mongoose.model<Account>('Account', accountSchema);
