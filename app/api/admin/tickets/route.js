import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';
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
        const category = searchParams.get('category');
        const priority = searchParams.get('priority');

        // Build query
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (category && category !== 'all') {
            query.category = category;
        }
        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        // Get total count
        const total = await Ticket.countDocuments(query);

        // Get tickets
        const tickets = await Ticket.find(query)
            .populate('userId', 'name email')
            .populate('assignedTo', 'name')
            .sort({ priority: -1, lastActivityAt: -1 })
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
                user: t.userId ? {
                    id: t.userId._id,
                    name: t.userId.name,
                    email: t.userId.email
                } : null,
                assignedTo: t.assignedTo ? {
                    id: t.assignedTo._id,
                    name: t.assignedTo.name
                } : null,
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
        console.error('Admin get tickets error:', error);
        return errorResponse('Failed to get tickets', 500, error.message);
    }
}
