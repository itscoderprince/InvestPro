import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/response';
import { validateRequest, loginSchema } from '@/lib/validation';
import ActivityLog from '@/models/ActivityLog';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate request body
        const validation = await validateRequest(loginSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { email, password } = validation.data;

        // Find user with password
        const user = await User.findByEmailWithPassword(email);

        if (!user) {
            return errorResponse('Invalid email or password', 401);
        }

        // Check if account is locked
        if (user.isLocked) {
            const lockRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return errorResponse(
                `Account is locked. Try again in ${lockRemaining} minutes`,
                423
            );
        }

        // Check if account is active
        if (!user.isActive) {
            return errorResponse('Account is deactivated. Contact support.', 403);
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            // Increment failed login attempts
            await user.incrementLoginAttempts();

            // Log failed attempt
            ActivityLog.log({
                userId: user._id,
                action: 'login',
                description: 'Failed login attempt',
                status: 'failure',
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });

            return errorResponse('Invalid email or password', 401);
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Generate tokens
        const accessToken = await generateAccessToken(user._id.toString(), user.role);
        const refreshToken = await generateRefreshToken(user._id.toString());

        // Save refresh token
        await User.findByIdAndUpdate(user._id, {
            refreshToken,
            lastLogin: new Date()
        });

        // Log successful login
        ActivityLog.log({
            userId: user._id,
            action: 'login',
            description: 'User logged in successfully',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
        });

        // Return response
        return successResponse({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                kycStatus: user.kycStatus,
                isEmailVerified: user.isEmailVerified,
                avatar: user.avatar
            },
            accessToken,
            refreshToken
        }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Login failed', 500, error.message);
    }
}
