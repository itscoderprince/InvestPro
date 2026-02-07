import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const paymentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        indexId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Index',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [1000, 'Minimum investment is ₹1,000']
        },
        requestId: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'proof_uploaded', 'verified', 'approved', 'rejected', 'expired'],
            default: 'pending'
        },
        paymentProof: {
            type: String
        },
        paymentMethod: {
            type: String,
            enum: ['bank_transfer', 'upi', 'other'],
            default: 'bank_transfer'
        },
        transactionReference: {
            type: String
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verifiedAt: {
            type: Date
        },
        rejectionReason: {
            type: String
        },
        expiresAt: {
            type: Date
        },
        investmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Investment'
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
paymentRequestSchema.index({ requestId: 1 }, { unique: true });
paymentRequestSchema.index({ userId: 1 });
paymentRequestSchema.index({ status: 1 });
paymentRequestSchema.index({ expiresAt: 1 });
paymentRequestSchema.index({ createdAt: -1 });

// Generate request ID before saving removed due to next() error in this environment

// Virtual to check if expired
paymentRequestSchema.virtual('isExpired').get(function () {
    return this.expiresAt && this.expiresAt < new Date() && this.status === 'pending';
});

// Virtual for time remaining
paymentRequestSchema.virtual('timeRemaining').get(function () {
    if (!this.expiresAt || this.status !== 'pending') return null;
    const remaining = this.expiresAt - new Date();
    if (remaining <= 0) return 'Expired';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
});

// Virtual to populate user
paymentRequestSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Virtual to populate index
paymentRequestSchema.virtual('index', {
    ref: 'Index',
    localField: 'indexId',
    foreignField: '_id',
    justOne: true
});

// Method to upload proof
paymentRequestSchema.methods.uploadProof = async function (proofUrl, transactionRef) {
    this.paymentProof = proofUrl;
    this.transactionReference = transactionRef;
    this.status = 'proof_uploaded';
    return await this.save();
};

// Method to approve payment and create investment
paymentRequestSchema.methods.approve = async function (adminId) {
    const Investment = mongoose.model('Investment');
    const Index = mongoose.model('Index');

    // Create investment
    const investment = await Investment.create({
        userId: this.userId,
        indexId: this.indexId,
        amount: this.amount,
        paymentRequestId: this._id,
        isActive: true,
        status: 'active',
        activatedAt: new Date()
    });

    // Update payment request
    this.status = 'approved';
    this.verifiedBy = adminId;
    this.verifiedAt = new Date();
    this.investmentId = investment._id;
    await this.save();

    // Update index stats
    const index = await Index.findById(this.indexId);
    if (index) {
        await index.updateStats();
    }

    return { paymentRequest: this, investment };
};

// Method to reject payment
paymentRequestSchema.methods.reject = async function (adminId, reason) {
    this.status = 'rejected';
    this.verifiedBy = adminId;
    this.verifiedAt = new Date();
    this.rejectionReason = reason;
    return await this.save();
};

// Static to get pending count
paymentRequestSchema.statics.getPendingCount = function () {
    return this.countDocuments({ status: { $in: ['pending', 'proof_uploaded'] } });
};

// Static to expire old requests
paymentRequestSchema.statics.expireOldRequests = async function () {
    const result = await this.updateMany(
        {
            status: 'pending',
            expiresAt: { $lt: new Date() }
        },
        {
            $set: { status: 'expired' }
        }
    );
    return result.modifiedCount;
};

// Force model re-registration in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.PaymentRequest;
}

// Force model re-registration in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.PaymentRequest;
}

export default mongoose.models.PaymentRequest || mongoose.model('PaymentRequest', paymentRequestSchema);
