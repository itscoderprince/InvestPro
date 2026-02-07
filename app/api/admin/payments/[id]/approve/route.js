// File updated to resolve stale build cache error
import connectDB from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import { requireAdmin } from '@/lib/middleware/auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import { sendPaymentApprovedEmail } from '@/lib/email';
import ActivityLog from '@/models/ActivityLog';

// PUT/POST - Approve Payment
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const paymentRequest = await PaymentRequest.findById(id).populate('userId');
        if (!paymentRequest) {
            return notFoundResponse('Payment request not found');
        }

        if (paymentRequest.status === 'approved') {
            return errorResponse('Payment is already approved', 400);
        }

        // Use model method to approve
        const result = await paymentRequest.approve(auth.user._id);

        // Send confirmation email (non-blocking)
        sendPaymentApprovedEmail(paymentRequest.userId, result.investment).catch(console.error);

        // Log activity
        ActivityLog.log({
            userId: auth.user._id,
            action: 'payment_approve',
            description: `Approved payment of ₹${paymentRequest.amount} for user: ${paymentRequest.userId.email}`,
            targetId: paymentRequest._id,
            targetType: 'PaymentRequest'
        });

        return successResponse({
            paymentRequest: result.paymentRequest,
            investment: result.investment
        }, 'Payment approved and investment created successfully');
    } catch (error) {
        console.error('Admin approve payment error:', error);
        return errorResponse('Failed to approve payment', 500, error.message);
    }
}

export async function POST(request, { params }) {
    return PUT(request, { params });
}
