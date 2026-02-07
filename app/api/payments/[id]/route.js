import connectDB from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import { requireAuth } from '@/lib/middleware/auth';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import PlatformSettings from '@/models/PlatformSettings';

// GET - Get payment request details
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAuth(request);
        if (!auth.success) {
            return auth.response;
        }

        const paymentRequest = await PaymentRequest.findOne({
            _id: id,
            userId: auth.user._id
        }).populate('indexId', 'name');

        if (!paymentRequest) {
            return notFoundResponse('Payment request not found');
        }

        const paymentSettings = await PlatformSettings.getByCategory('payment');

        return successResponse({
            paymentRequest,
            paymentDetails: {
                bankName: paymentSettings.bankName || 'HDFC Bank',
                accountNumber: paymentSettings.bankAccountNumber || '1234567890',
                accountName: paymentSettings.bankAccountHolder || 'InvestPro Pvt Ltd',
                ifscCode: paymentSettings.bankIfsc || 'HDFC0001234',
                upiId: paymentSettings.upiId || 'investpro@hdfc'
            }
        });
    } catch (error) {
        console.error('Get payment details error:', error);
        return errorResponse('Failed to get payment details', 500, error.message);
    }
}
