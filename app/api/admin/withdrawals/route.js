import connectDB from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import { requireAdmin } from '@/lib/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { parsePagination } from '@/lib/validation';

export async function GET(request) {
    try {
        await connectDB();

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const { searchParams } = new URL(request.url);
        const pagination = parsePagination(searchParams);
        const status = searchParams.get('status');

        // Build query
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count
        const total = await Withdrawal.countDocuments(query);

        // Get withdrawals
        const withdrawals = await Withdrawal.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .lean();

        return successResponse({
            withdrawals: withdrawals.map(w => ({
                id: w._id,
                requestId: w.requestId,
                amount: w.amount,
                netAmount: w.netAmount,
                processingFee: w.processingFee,
                status: w.status,
                bankDetails: w.bankDetails,
                user: w.userId ? {
                    id: w.userId._id,
                    name: w.userId.name,
                    email: w.userId.email
                } : null,
                createdAt: w.createdAt,
                processedAt: w.processedAt
            })),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit)
            }
        }, 'Withdrawals retrieved');

    } catch (error) {
        console.error('Admin get withdrawals error:', error);
        return errorResponse('Failed to get withdrawals', 500, error.message);
    }
}
