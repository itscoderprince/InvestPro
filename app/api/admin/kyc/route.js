import connectDB from '@/lib/db';
import KYC from '@/models/KYC';
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
        const total = await KYC.countDocuments(query);

        // Get KYC records
        const kycRecords = await KYC.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .lean();

        return successResponse({
            records: kycRecords.map(k => ({
                id: k._id,
                user: k.userId ? {
                    id: k.userId._id,
                    name: k.userId.name,
                    email: k.userId.email,
                    phone: k.userId.phone
                } : null,
                status: k.status,
                aadharNumber: k.aadharNumber,
                panNumber: k.panNumber,
                aadharUrl: k.aadharUrl,
                panUrl: k.panUrl,
                rejectionReason: k.rejectionReason,
                submittedAt: k.submittedAt,
                verifiedAt: k.verifiedAt,
                resubmissionCount: k.resubmissionCount
            })),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit)
            }
        }, 'KYC records retrieved');

    } catch (error) {
        console.error('Admin get KYC error:', error);
        return errorResponse('Failed to get KYC records', 500, error.message);
    }
}
