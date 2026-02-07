import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    senderName: {
        type: String
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    attachments: [{
        type: String
    }],
    isInternal: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ticketId: {
            type: String
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: 2000
        },
        category: {
            type: String,
            enum: ['payment', 'kyc', 'investment', 'withdrawal', 'account', 'technical', 'other'],
            required: true
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'waiting', 'resolved', 'closed'],
            default: 'open'
        },
        attachments: [{
            type: String
        }],
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        messages: {
            type: [messageSchema],
            default: []
        },
        closedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        closedAt: {
            type: Date
        },
        resolvedAt: {
            type: Date
        },
        lastActivityAt: {
            type: Date,
            default: Date.now
        },
        firstResponseAt: {
            type: Date
        },
        tags: [{
            type: String
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
ticketSchema.index({ ticketId: 1 }, { unique: true });
ticketSchema.index({ userId: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ lastActivityAt: -1 });

// Generate ticket ID
ticketSchema.pre('save', function (next) {
    if (!this.ticketId) {
        this.ticketId = `TKT-${nanoid(8).toUpperCase()}`;
    }
    next();
});

// Virtual to populate user
ticketSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Virtual for priority color
ticketSchema.virtual('priorityColor').get(function () {
    const colors = {
        low: 'green',
        medium: 'yellow',
        high: 'orange',
        urgent: 'red'
    };
    return colors[this.priority] || 'gray';
});

// Virtual for status color
ticketSchema.virtual('statusColor').get(function () {
    const colors = {
        open: 'blue',
        'in-progress': 'yellow',
        waiting: 'orange',
        resolved: 'green',
        closed: 'gray'
    };
    return colors[this.status] || 'gray';
});

// Virtual for reply count
ticketSchema.virtual('replyCount').get(function () {
    return this.messages.length;
});

// Virtual for time since last activity
ticketSchema.virtual('timeSinceActivity').get(function () {
    const now = new Date();
    const lastActivity = this.lastActivityAt || this.createdAt;
    const diff = now - lastActivity;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
});

// Method to add message
ticketSchema.methods.addMessage = async function (userId, message, role, senderName, attachments = []) {
    this.messages.push({
        sender: userId,
        senderRole: role,
        senderName: senderName,
        message,
        attachments,
        timestamp: new Date()
    });

    this.lastActivityAt = new Date();

    // Set first response time if admin is replying
    if (role === 'admin' && !this.firstResponseAt) {
        this.firstResponseAt = new Date();
    }

    // Update status if needed
    if (this.status === 'open' && role === 'admin') {
        this.status = 'in-progress';
    } else if (this.status === 'waiting' && role === 'user') {
        this.status = 'in-progress';
    }

    return await this.save();
};

// Method to assign ticket
ticketSchema.methods.assignTo = async function (adminId) {
    this.assignedTo = adminId;
    if (this.status === 'open') {
        this.status = 'in-progress';
    }
    this.lastActivityAt = new Date();
    return await this.save();
};

// Method to resolve ticket
ticketSchema.methods.resolve = async function (adminId) {
    this.status = 'resolved';
    this.resolvedAt = new Date();
    this.lastActivityAt = new Date();
    return await this.save();
};

// Method to close ticket
ticketSchema.methods.close = async function (userId) {
    this.status = 'closed';
    this.closedBy = userId;
    this.closedAt = new Date();
    this.lastActivityAt = new Date();
    return await this.save();
};

// Method to reopen ticket
ticketSchema.methods.reopen = async function () {
    this.status = 'open';
    this.closedBy = undefined;
    this.closedAt = undefined;
    this.resolvedAt = undefined;
    this.lastActivityAt = new Date();
    return await this.save();
};

// Static to get open count
ticketSchema.statics.getOpenCount = function () {
    return this.countDocuments({ status: { $in: ['open', 'in-progress'] } });
};

// Static to get ticket stats
ticketSchema.statics.getStats = async function () {
    const result = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const stats = { open: 0, 'in-progress': 0, waiting: 0, resolved: 0, closed: 0 };
    result.forEach(item => {
        stats[item._id] = item.count;
    });

    return stats;
};

// Static to get category stats
ticketSchema.statics.getCategoryStats = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// Force model re-registration in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Ticket;
}

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
