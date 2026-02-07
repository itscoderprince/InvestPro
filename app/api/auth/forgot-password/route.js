import connectDB from '@/lib/db';
import User from '@/models/User';
import { generatePasswordResetToken, verifyPasswordResetToken, hashPassword } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/response';
import { validateRequest, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import ActivityLog from '@/models/ActivityLog';

// POST - Request password reset
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        // Check if this is a reset request or forgot request
        if (body.token) {
            // This is a reset password request
            return await resetPassword(body, request);
        }

        // Validate request body
        const validation = await validateRequest(forgotPasswordSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { email } = validation.data;

        // Find user
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration
        if (!user) {
            return successResponse(null, 'If the email exists, a password reset link has been sent');
        }

        if (!user.isActive) {
            return successResponse(null, 'If the email exists, a password reset link has been sent');
        }

        // Generate reset token
        const resetToken = await generatePasswordResetToken(user._id.toString(), user.email);

        // Send reset email
        await sendPasswordResetEmail(user, resetToken);

        // Log activity
        ActivityLog.log({
            userId: user._id,
            action: 'password_reset',
            description: 'Password reset requested',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
        });

        return successResponse(null, 'If the email exists, a password reset link has been sent');

    } catch (error) {
        console.error('Forgot password error:', error);
        return errorResponse('Failed to process request', 500, error.message);
    }
}

// Reset password with token
async function resetPassword(body, request) {
    // Validate reset request
    const validation = await validateRequest(resetPasswordSchema, body);
    if (!validation.success) {
        return validationErrorResponse(validation.errors);
    }

    const { token, password } = validation.data;

    // Verify token
    const payload = await verifyPasswordResetToken(token);

    if (!payload) {
        return errorResponse('Invalid or expired reset token', 400);
    }

    // Find user
    const user = await User.findById(payload.userId);

    if (!user) {
        return errorResponse('User not found', 404);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Log activity
    ActivityLog.log({
        userId: user._id,
        action: 'password_change',
        description: 'Password reset successfully',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return successResponse(null, 'Password reset successfully');
}
