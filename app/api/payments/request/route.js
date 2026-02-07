import connectDB from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import Index from '@/models/Index';
import { nanoid } from 'nanoid';
import { requireKYC } from '@/lib/middleware/auth';
import { successResponse, errorResponse, validationErrorResponse, createdResponse } from '@/lib/response';
import { validateRequest, createPaymentRequestSchema } from '@/lib/validation';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import ActivityLog from '@/models/ActivityLog';
import PlatformSettings from '@/models/PlatformSettings';

export async function POST(request) {
    try {
        await connectDB();

        // Require KYC approved
        const auth = await requireKYC(request);
        if (!auth.success) {
            return auth.response;
        }

        const { user } = auth;
        const body = await request.json();

        // Validate request
        const validation = await validateRequest(createPaymentRequestSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { indexId, amount, paymentMethod } = validation.data;

        // Find index
        const index = await Index.findById(indexId);
        if (!index) {
            return errorResponse('Investment index not found', 404);
        }
        if (!index.isActive) {
            return errorResponse('This investment index is not active', 400);
        }

        // Check investment limits
        if (amount < index.minInvestment) {
            return errorResponse(`Minimum investment for this index is â‚¹${index.minInvestment.toLocaleString()}`, 400);
        }
        if (amount > index.maxInvestment) {
            return errorResponse(`Maximum investment for this index is â‚¹${index.maxInvestment.toLocaleString()}`, 400);
        }

        // Check for existing pending payment request
        const existingRequest = await PaymentRequest.findOne({
            userId: user._id,
            status: { $in: ['pending', 'proof_uploaded'] }
        });

        if (existingRequest) {
            return errorResponse('You have a pending payment request. Please complete or wait for it to expire.', 400);
        }

        // Create payment request
        const paymentRequest = await PaymentRequest.create({
            userId: user._id,
            indexId: index._id,
            amount,
            paymentMethod: paymentMethod || 'bank_transfer',
            duration: body.duration || 'flexible',
            requestId: `PAY-${nanoid(8).toUpperCase()}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        // Get payment details from settings with safety fallback
        let paymentSettings = {};
        try {
            paymentSettings = await PlatformSettings.getByCategory('payment') || {};
        } catch (settingsError) {
            console.warn('⚠️ Failed to load payment settings, using defaults:', settingsError.message);
        }

        // Send confirmation email
        sendPaymentConfirmationEmail(user, paymentRequest).catch(err => {
            console.error('❌ Failed to send payment confirmation email:', err.message);
        });

        // Log activity
        ActivityLog.log({
            userId: user._id,
            action: 'payment_request',
            description: `Payment request created for ₹${amount}`,
            targetId: paymentRequest._id,
            targetType: 'PaymentRequest',
            metadata: { amount, indexId }
        });

        return createdResponse({
            id: paymentRequest._id,
            requestId: paymentRequest.requestId,
            amount: paymentRequest.amount,
            status: paymentRequest.status,
            expiresAt: paymentRequest.expiresAt,
            paymentDetails: {
                bankName: paymentSettings.bankName || 'HDFC Bank',
                accountNumber: paymentSettings.bankAccountNumber || '1234567890',
                ifscCode: paymentSettings.bankIfsc || 'HDFC0001234',
                accountHolder: paymentSettings.bankAccountHolder || 'InvestPro Pvt Ltd',
                upiId: paymentSettings.upiId || 'investpro@hdfc'
            },
            index: {
                id: index._id,
                name: index.name
            }
        }, 'Payment request created successfully');

    } catch (error) {
        console.error('Create payment request error:', error);
        return errorResponse('Failed to create payment request', 500, error.message);
    }
}
