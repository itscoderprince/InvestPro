import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateAccessToken, generateRefreshToken, generateEmailVerificationToken, validatePassword } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse, createdResponse } from '@/lib/response';
import { validateRequest, registerSchema } from '@/lib/validation';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';
import ActivityLog from '@/models/ActivityLog';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate request body
        const validation = await validateRequest(registerSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { email, password, name, phone } = validation.data;

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return errorResponse(passwordValidation.message, 400);
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return errorResponse('Email already registered', 409);
            }
            if (existingUser.phone === phone) {
                return errorResponse('Phone number already registered', 409);
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'user',
            kycStatus: 'pending',
            isActive: true,
            isEmailVerified: false
        });

        // Generate tokens
        const accessToken = await generateAccessToken(user._id.toString(), user.role);
        const refreshToken = await generateRefreshToken(user._id.toString());

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Generate email verification token
        const emailToken = await generateEmailVerificationToken(user._id.toString(), user.email);

        // Send emails (non-blocking)
        Promise.all([
            sendWelcomeEmail(user),
            sendVerificationEmail(user, emailToken)
        ]).catch(err => console.error('Email send error:', err));

        // Log activity
        ActivityLog.log({
            userId: user._id,
            action: 'register',
            description: 'User registered successfully',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
        });

        // Return response
        return createdResponse({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                kycStatus: user.kycStatus,
                isEmailVerified: user.isEmailVerified
            },
            accessToken,
            refreshToken
        }, 'Registration successful');

    } catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return errorResponse(`${field} already exists`, 409);
        }

        return errorResponse('Registration failed', 500, error.message);
    }
}
