import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number (10 digits starting with 6-9)')
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

// ==================== USER SCHEMAS ====================

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional()
});

// ==================== KYC SCHEMAS ====================

export const kycUploadSchema = z.object({
    aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits'),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format. Expected: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)')
});

export const kycRejectSchema = z.object({
    reason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(500)
});

// ==================== INVESTMENT SCHEMAS ====================

export const createInvestmentSchema = z.object({
    indexId: z.string().min(1, 'Index ID is required'),
    amount: z.number()
        .min(parseInt(process.env.MIN_INVESTMENT) || 5000, 'Minimum investment is ₹5,000')
        .max(parseInt(process.env.MAX_INVESTMENT) || 1000000, 'Maximum investment is ₹10,00,000')
});

// ==================== PAYMENT SCHEMAS ====================

export const createPaymentRequestSchema = z.object({
    indexId: z.string().min(1, 'Index ID is required'),
    amount: z.number()
        .min(parseInt(process.env.MIN_INVESTMENT) || 5000, 'Minimum investment is ₹5,000')
        .max(parseInt(process.env.MAX_INVESTMENT) || 1000000, 'Maximum investment is ₹10,00,000'),
    paymentMethod: z.enum(['bank_transfer', 'upi', 'other']).optional()
});

export const uploadPaymentProofSchema = z.object({
    paymentRequestId: z.string().min(1, 'Payment request ID is required'),
    transactionReference: z.string().min(1, 'Transaction reference is required').max(100)
});

// ==================== WITHDRAWAL SCHEMAS ====================

export const createWithdrawalSchema = z.object({
    amount: z.number()
        .min(parseInt(process.env.MIN_WITHDRAWAL) || 500, 'Minimum withdrawal is ₹500')
        .max(parseInt(process.env.MAX_WITHDRAWAL) || 100000, 'Maximum withdrawal is ₹1,00,000'),
    bankDetails: z.object({
        accountHolder: z.string().min(3, 'Account holder name required'),
        accountNumber: z.string().min(9, 'Invalid account number').max(18),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
        bankName: z.string().min(3, 'Bank name required')
    })
});

export const approveWithdrawalSchema = z.object({
    transactionReference: z.string().min(1, 'Transaction reference is required')
});

export const rejectWithdrawalSchema = z.object({
    reason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(500)
});

// ==================== TICKET SCHEMAS ====================

export const createTicketSchema = z.object({
    subject: z.string().min(5, 'Subject too short').max(200),
    description: z.string().min(20, 'Description too short').max(2000),
    category: z.enum(['payment', 'kyc', 'investment', 'withdrawal', 'account', 'technical', 'other']),
    priority: z.enum(['low', 'medium', 'high']).optional()
});

export const ticketReplySchema = z.object({
    message: z.string().min(1, 'Message is required').max(2000)
});

export const assignTicketSchema = z.object({
    adminId: z.string().min(1, 'Admin ID is required')
});

// ==================== ADMIN SCHEMAS ====================

export const createIndexSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100),
    description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
    minInvestment: z.number().min(1000, 'Minimum investment must be at least ₹1,000'),
    maxInvestment: z.number().max(10000000, 'Maximum investment cannot exceed ₹1,00,00,000').optional(),
    currentReturnRate: z.number().min(3).max(5).optional(),
    category: z.enum(['technology', 'healthcare', 'finance', 'energy', 'other']),
    riskLevel: z.enum(['low', 'medium', 'high']).optional(),
    features: z.array(z.string()).optional(),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional()
});

export const updateIndexSchema = createIndexSchema.partial();

export const setReturnRateSchema = z.object({
    indexId: z.string().min(1, 'Index ID is required'),
    returnRate: z.number().min(3, 'Minimum rate is 3%').max(5, 'Maximum rate is 5%'),
    weekStart: z.string().datetime(),
    weekEnd: z.string().datetime()
});

export const distributeReturnsSchema = z.object({
    indexId: z.string().optional(), // If not provided, distribute to all active indices
    returnRate: z.number().min(3).max(5),
    weekStart: z.string().datetime(),
    weekEnd: z.string().datetime()
});

export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    role: z.enum(['user', 'admin']).optional()
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
    isActive: z.boolean().optional(),
    role: z.enum(['user', 'admin']).optional()
});

// ==================== SETTINGS SCHEMAS ====================

export const platformSettingsSchema = z.object({
    siteName: z.string().optional(),
    siteDescription: z.string().optional(),
    minInvestment: z.number().optional(),
    maxInvestment: z.number().optional(),
    minWithdrawal: z.number().optional(),
    maxWithdrawal: z.number().optional(),
    minWeeklyReturn: z.number().optional(),
    maxWeeklyReturn: z.number().optional()
});

export const emailSettingsSchema = z.object({
    fromEmail: z.string().email().optional(),
    fromName: z.string().optional(),
    smtpHost: z.string().optional(),
    smtpPort: z.number().optional(),
    smtpUser: z.string().optional(),
    smtpPass: z.string().optional()
});

export const paymentSettingsSchema = z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
    accountHolder: z.string().optional(),
    upiId: z.string().optional()
});

export const maintenanceSettingsSchema = z.object({
    isMaintenanceMode: z.boolean(),
    maintenanceMessage: z.string().optional()
});

// ==================== PAGINATION SCHEMA ====================

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});

// ==================== VALIDATION HELPER ====================

export async function validateRequest(schema, data) {
    try {
        const validated = await schema.parseAsync(data);
        return { success: true, data: validated };
    } catch (error) {
        // If it's a ZodError, it will have an errors array
        if (error.errors && Array.isArray(error.errors)) {
            return {
                success: false,
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        // Handle cases where it's a ZodError but uses .issues instead of .errors
        if (error.issues && Array.isArray(error.issues)) {
            return {
                success: false,
                errors: error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        // If it's some other error, log it and return a message
        console.error('Unexpected validation error:', error);
        return {
            success: false,
            errors: [{
                field: 'server',
                message: error.message || 'An unexpected error occurred during validation'
            }]
        };
    }
}

// Parse pagination from URL search params
export function parsePagination(searchParams) {
    return {
        page: parseInt(searchParams.get('page')) || 1,
        limit: Math.min(parseInt(searchParams.get('limit')) || 10, 100),
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') === 'asc' ? 1 : -1
    };
}
