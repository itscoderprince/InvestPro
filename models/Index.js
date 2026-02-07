import mongoose from 'mongoose';

const indexSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Index name is required'],
            unique: true,
            trim: true,
            maxlength: 100
        },
        slug: {
            type: String,
            lowercase: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: 1000
        },
        shortDescription: {
            type: String,
            maxlength: 200
        },
        minInvestment: {
            type: Number,
            required: true,
            min: [1000, 'Minimum investment must be at least ₹1,000']
        },
        maxInvestment: {
            type: Number,
            default: 1000000
        },
        currentReturnRate: {
            type: Number,
            default: 4,
            min: [3, 'Minimum return rate is 3%'],
            max: [5, 'Maximum return rate is 5%']
        },
        category: {
            type: String,
            required: true,
            enum: ['technology', 'healthcare', 'finance', 'energy', 'other']
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        totalInvested: {
            type: Number,
            default: 0
        },
        activeInvestors: {
            type: Number,
            default: 0
        },
        totalReturnsDistributed: {
            type: Number,
            default: 0
        },
        features: {
            type: [String],
            default: []
        },
        icon: {
            type: String,
            default: 'TrendingUp'
        },
        color: {
            type: String,
            default: '#2563eb',
            match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid color format']
        },
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Auto-generate slug before saving
indexSchema.pre('save', function () {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Auto-generate short description if not provided
    if (this.isModified('description') && !this.shortDescription) {
        this.shortDescription = this.description.substring(0, 150) + (this.description.length > 150 ? '...' : '');
    }
});

// Indexes
indexSchema.index({ slug: 1 }, { unique: true });
indexSchema.index({ isActive: 1 });
indexSchema.index({ category: 1 });
indexSchema.index({ sortOrder: 1 });
indexSchema.index({ currentReturnRate: -1 });

// Virtual for formatted min investment
indexSchema.virtual('minInvestmentFormatted').get(function () {
    return '₹' + this.minInvestment.toLocaleString('en-IN');
});

// Virtual for risk badge color
indexSchema.virtual('riskBadgeColor').get(function () {
    const colors = {
        low: 'green',
        medium: 'yellow',
        high: 'red'
    };
    return colors[this.riskLevel] || 'gray';
});

// Method to update stats from investments
indexSchema.methods.updateStats = async function () {
    const Investment = mongoose.model('Investment');

    const stats = await Investment.aggregate([
        {
            $match: {
                indexId: this._id,
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                totalInvested: { $sum: '$amount' },
                totalReturns: { $sum: '$totalReturns' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        this.totalInvested = stats[0].totalInvested;
        this.totalReturnsDistributed = stats[0].totalReturns;
        this.activeInvestors = stats[0].count;
    } else {
        this.totalInvested = 0;
        this.totalReturnsDistributed = 0;
        this.activeInvestors = 0;
    }

    return await this.save();
};

// Method to toggle active status
indexSchema.methods.toggleActive = async function () {
    this.isActive = !this.isActive;
    return await this.save();
};

// Static to get active indices
indexSchema.statics.getActiveIndices = function () {
    return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static to get index stats summary
indexSchema.statics.getStatsSummary = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalIndices: { $sum: 1 },
                activeIndices: { $sum: { $cond: ['$isActive', 1, 0] } },
                totalInvested: { $sum: '$totalInvested' },
                totalInvestors: { $sum: '$activeInvestors' }
            }
        }
    ]);
    return stats[0] || { totalIndices: 0, activeIndices: 0, totalInvested: 0, totalInvestors: 0 };
};

// Force model re-registration in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Index;
}

export default mongoose.models.Index || mongoose.model('Index', indexSchema);
