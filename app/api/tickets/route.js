import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';
import { requireAuth } from '@/lib/middleware/auth';
import { successResponse, errorResponse, validationErrorResponse, createdResponse } from '@/lib/response';
import { validateRequest, createTicketSchema } from '@/lib/validation';
import { sendTicketConfirmationEmail } from '@/lib/email';
import ActivityLog from '@/models/ActivityLog';
import { parsePagination } from '@/lib/validation';

// GET - List user's tickets
export async function GET(request) {
    try {
        await connectDB();

        const auth = await requireAuth(request);
        if (!auth.success) {
            return auth.response;
        }

        const { user } = auth;
        const { searchParams } = new URL(request.url);
        const pagination = parsePagination(searchParams);
        const status = searchParams.get('status');

        // Build query
        const query = { userId: user._id };
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count
        const total = await Ticket.countDocuments(query);

        // Get tickets
        const tickets = await Ticket.find(query)
            .sort({ lastActivityAt: -1 })
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .lean();

        return successResponse({
            tickets: tickets.map(t => ({
                id: t._id,
                ticketId: t.ticketId,
                subject: t.subject,
                category: t.category,
                priority: t.priority,
                status: t.status,
                replyCount: t.messages.length,
                createdAt: t.createdAt,
                lastActivityAt: t.lastActivityAt
            })),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                pages: Math.ceil(total / pagination.limit)
            }
        }, 'Tickets retrieved');

    } catch (error) {
        console.error('Get tickets error:', error);
        return errorResponse('Failed to get tickets', 500, error.message);
    }
}

// POST - Create new ticket
export async function POST(request) {
    try {
        await connectDB();

        const auth = await requireAuth(request);
        if (!auth.success) {
            return auth.response;
        }

        const { user } = auth;
        const body = await request.json();

        // Validate request
        const validation = await validateRequest(createTicketSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const { subject, description, category } = validation.data;

        // Create ticket
        const ticket = await Ticket.create({
            userId: user._id,
            subject,
            description,
            category
        });

        // Send notification email
        sendTicketConfirmationEmail(user, ticket).catch(console.error);

        // Log activity
        ActivityLog.log({
            userId: user._id,
            action: 'ticket_create',
            description: `Support ticket created: ${subject}`,
            targetId: ticket._id,
            targetType: 'Ticket'
        });

        return createdResponse({
            id: ticket._id,
            ticketId: ticket.ticketId,
            subject: ticket.subject,
            category: ticket.category,
            status: ticket.status,
            createdAt: ticket.createdAt
        }, 'Ticket created successfully');

    } catch (error) {
        console.error('Create ticket error:', error);
        return errorResponse('Failed to create ticket', 500, error.message);
    }
}
