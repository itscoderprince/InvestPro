import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response';
import Investment from '@/models/Investment';
import PaymentRequest from '@/models/PaymentRequest';
import Withdrawal from '@/models/Withdrawal';
import Ticket from '@/models/Ticket';
import KYC from '@/models/KYC';

export async function GET(request) {
    try {
        await connectDB();

        const auth = await requireAuth(request);
        if (!auth.success) {
            return auth.response;
        }

        const { user } = auth;
        const userId = user._id;

        // Get investment summary
        const investmentSummary = await Investment.getUserTotalInvestment(userId);
        const activeInvestments = await Investment.countDocuments({ userId, isActive: true });

        // Get pending items
        const pendingPayments = await PaymentRequest.countDocuments({
            userId,
            status: { $in: ['pending', 'proof_uploaded'] }
        });
        const pendingWithdrawals = await Withdrawal.countDocuments({
            userId,
            status: 'pending'
        });
        const openTickets = await Ticket.countDocuments({
            userId,
            status: { $in: ['open', 'in-progress'] }
        });

        // Get KYC status
        const kyc = await KYC.findOne({ userId }).select('status submittedAt');

        // Get recent investments
        const recentInvestments = await Investment.find({ userId, isActive: true })
            .populate('indexId', 'name slug color')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Get available balance (total returns - pending withdrawals)
        const pendingWithdrawalAmount = await Withdrawal.getUserPendingTotal(userId);
        const availableBalance = investmentSummary.totalReturns - pendingWithdrawalAmount;

        return successResponse({
            user: {
                name: user.name,
                email: user.email,
                kycStatus: user.kycStatus,
                isEmailVerified: user.isEmailVerified
            },
            summary: {
                totalInvested: investmentSummary.total,
                totalReturns: investmentSummary.totalReturns,
                currentValue: investmentSummary.total + investmentSummary.totalReturns,
                walletBalance: Math.max(0, availableBalance),
                activeInvestmentsCount: activeInvestments
            },
            pendingItems: {
                payments: pendingPayments,
                withdrawals: pendingWithdrawals,
                tickets: openTickets
            },
            kyc: kyc ? {
                status: kyc.status,
                submittedAt: kyc.submittedAt
            } : null,
            recentInvestments: recentInvestments.map(inv => ({
                _id: inv._id,
                amount: inv.amount,
                totalReturns: inv.totalReturns,
                index: inv.indexId,
                status: inv.status,
                activatedAt: inv.activatedAt
            }))
        }, 'Dashboard data retrieved');

    } catch (error) {
        console.error('Dashboard error:', error);
        return errorResponse('Failed to get dashboard data', 500, error.message);
    }
}
