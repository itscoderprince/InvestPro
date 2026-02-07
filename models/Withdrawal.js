import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const withdrawalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [500, 'Minimum withdrawal is ₹500']
        },
        requestId: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'approved', 'rejected', 'completed', 'failed'],
            default: 'pending'
        },
        bankDetails: {
            accountHolder: {
                type: String,
                required: true
            },
            accountNumber: {
                type: String,
                required: true
            },
            ifscCode: {
                type: String,
                required: true,
                uppercase: true
            },
            bankName: {
                type: String,
                required: true
            }
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        processedAt: {
            type: Date
        },
        transactionReference: {
            type: String
        },
        rejectionReason: {
            type: String
        },
        notes: {
            type: String
        },
        processingFee: {
            type: Number,
            default: 0
        },
        netAmount: {
            type: Number
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
withdrawalSchema.index({ requestId: 1 }, { unique: true });
withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ createdAt: -1 });
withdrawalSchema.index({ processedAt: -1 });

// Generate request ID
withdrawalSchema.pre('save', function (next) {
    if (!this.requestId) {
        this.requestId = `WTH-${nanoid(8).toUpperCase()}`;
    }
    // Calculate net amount
    if (!this.netAmount) {
        this.netAmount = this.amount - (this.processingFee || 0);
    }
    next();
});

// Virtual for masked account number
withdrawalSchema.virtual('maskedAccountNumber').get(function () {
    if (!this.bankDetails?.accountNumber) return null;
    const accNum = this.bankDetails.accountNumber;
    return 'XXXX' + accNum.slice(-4);
});

// Virtual to populate user
withdrawalSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Method to approve withdrawal
withdrawalSchema.methods.approve = async function (adminId, transactionRef) {
    this.status = 'approved';
    this.processedBy = adminId;
    this.processedAt = new Date();
    this.transactionReference = transactionRef;
    return await this.save();
};

// Method to reject withdrawal
withdrawalSchema.methods.reject = async function (adminId, reason) {
    this.status = 'rejected';
    this.processedBy = adminId;
    this.processedAt = new Date();
    this.rejectionReason = reason;
    return await this.save();
};

// Method to mark as completed
withdrawalSchema.methods.complete = async function () {
    this.status = 'completed';
    return await this.save();
};

// Method to mark as failed
withdrawalSchema.methods.fail = async function (reason) {
    this.status = 'failed';
    this.notes = reason;
    return await this.save();
};

// Static to get pending count
withdrawalSchema.statics.getPendingCount = function () {
    return this.countDocuments({ status: 'pending' });
};

// Static to get user's pending withdrawals total
withdrawalSchema.statics.getUserPendingTotal = async function (userId) {
    const result = await this.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['pending', 'processing', 'approved'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);
    return result[0]?.total || 0;
};

// Static to get withdrawal stats
withdrawalSchema.statics.getStats = async function () {
    const result = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                total: { $sum: '$amount' }
            }
        }
    ]);

    const stats = {};
    result.forEach(item => {
        stats[item._id] = { count: item.count, total: item.total };
    });
    return stats;
};

// Force model re-registration in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Withdrawal;
}

export default mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);
