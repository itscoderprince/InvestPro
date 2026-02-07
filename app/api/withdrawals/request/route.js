import connectDB from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import Investment from '@/models/Investment';
import { requireKYC } from '@/lib/middleware/auth';
import { successResponse, errorResponse, validationErrorResponse, createdResponse } from '@/lib/response';
import { validateRequest, createWithdrawalSchema } from '@/lib/validation';
import { sendWithdrawalRequestEmail } from '@/lib/email';
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
        const validation = await validateRequest(createWithdrawalSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { amount, bankDetails } = validation.data;

        // Get platform settings
        const settings = await PlatformSettings.getByCategory('payment');
        const minWithdrawal = settings.minWithdrawal || 500;
        const maxWithdrawal = settings.maxWithdrawal || 100000;

        // Check withdrawal limits
        if (amount < minWithdrawal) {
            return errorResponse(`Minimum withdrawal is â‚¹${minWithdrawal.toLocaleString()}`, 400);
        }
        if (amount > maxWithdrawal) {
            return errorResponse(`Maximum withdrawal is â‚¹${maxWithdrawal.toLocaleString()}`, 400);
        }

        // Get user's available balance (total returns - pending withdrawals)
        const investmentSummary = await Investment.getUserTotalInvestment(user._id);
        const pendingWithdrawals = await Withdrawal.getUserPendingTotal(user._id);
        const availableBalance = investmentSummary.totalReturns - pendingWithdrawals;

        if (amount > availableBalance) {
            return errorResponse(`Insufficient balance. Available: â‚¹${availableBalance.toLocaleString()}`, 400);
        }

        // Create withdrawal request
        const withdrawal = await Withdrawal.create({
            userId: user._id,
            amount,
            bankDetails: {
                accountHolder: bankDetails.accountHolder,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode.toUpperCase(),
                bankName: bankDetails.bankName
            },
            processingFee: settings.withdrawalFee || 0
        });

        // Save bank details to user profile for future use
        await (await import('@/models/User')).default.findByIdAndUpdate(user._id, {
            bankDetails: {
                accountHolder: bankDetails.accountHolder,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode,
                bankName: bankDetails.bankName
            }
        });

        // Send confirmation email
        sendWithdrawalRequestEmail(user, withdrawal).catch(console.error);

        // Log activity
        ActivityLog.log({
            userId: user._id,
            action: 'withdrawal_request',
            description: `Withdrawal request created for â‚¹${amount}`,
            targetId: withdrawal._id,
            targetType: 'Withdrawal',
            metadata: { amount }
        });

        return createdResponse({
            id: withdrawal._id,
            requestId: withdrawal.requestId,
            amount: withdrawal.amount,
            netAmount: withdrawal.netAmount,
            processingFee: withdrawal.processingFee,
            status: withdrawal.status,
            bankDetails: {
                accountHolder: withdrawal.bankDetails.accountHolder,
                accountNumber: 'XXXX' + withdrawal.bankDetails.accountNumber.slice(-4),
                bankName: withdrawal.bankDetails.bankName
            },
            createdAt: withdrawal.createdAt
        }, 'Withdrawal request created successfully');

    } catch (error) {
        console.error('Create withdrawal error:', error);
        return errorResponse('Failed to create withdrawal request', 500, error.message);
    }
}
