import connectDB from '@/lib/db';
import { requireAdmin } from '@/lib/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response';
import User from '@/models/User';
import Investment from '@/models/Investment';
import PaymentRequest from '@/models/PaymentRequest';
import Withdrawal from '@/models/Withdrawal';
import Ticket from '@/models/Ticket';
import KYC from '@/models/KYC';
import Index from '@/models/Index';
import ActivityLog from '@/models/ActivityLog';

export async function GET(request) {
    try {
        await connectDB();

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        // Get overview stats
        const [
            totalUsers,
            activeUsers,
            pendingKYC,
            pendingPayments,
            pendingWithdrawals,
            openTickets,
            totalIndices,
            investmentStats,
            recentUsers,
            recentActivities
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'user', isActive: true }),
            KYC.countDocuments({ status: 'pending' }),
            PaymentRequest.countDocuments({ status: { $in: ['pending', 'proof_uploaded'] } }),
            Withdrawal.countDocuments({ status: 'pending' }),
            Ticket.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
            Index.countDocuments({}),
            Investment.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        totalInvested: { $sum: '$amount' },
                        totalReturns: { $sum: '$totalReturns' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            User.find({ role: 'user' })
                .select('name email kycStatus createdAt')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            ActivityLog.find({})
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean()
        ]);

        const stats = investmentStats[0] || { totalInvested: 0, totalReturns: 0, count: 0 };

        return successResponse({
            overview: {
                totalUsers,
                activeUsers,
                activeInvestments: stats.count,
                totalInvested: stats.totalInvested,
                totalReturns: stats.totalReturns
            },
            pending: {
                kyc: pendingKYC,
                payments: pendingPayments,
                withdrawals: pendingWithdrawals,
                tickets: openTickets
            },
            indices: {
                total: totalIndices
            },
            recentUsers: recentUsers.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                kycStatus: u.kycStatus,
                createdAt: u.createdAt
            })),
            activities: recentActivities.map(a => ({
                id: a._id,
                user: a.userId?.name || 'Unknown',
                email: a.userId?.email || '',
                action: a.action,
                description: a.description,
                status: a.status,
                createdAt: a.createdAt
            }))
        }, 'Dashboard data retrieved');

    } catch (error) {
        console.error('Admin dashboard error:', error);
        return errorResponse('Failed to get dashboard data', 500, error.message);
    }
}
