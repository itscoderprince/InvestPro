import connectDB from '@/lib/db';
import Index from '@/models/Index';
import { requireAdmin } from '@/lib/middleware/auth';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/response';
import { validateRequest, updateIndexSchema } from '@/lib/validation';
import ActivityLog from '@/models/ActivityLog';

// GET - Get single index (Admin)
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const index = await Index.findById(id);
        if (!index) {
            return notFoundResponse('Index not found');
        }

        return successResponse(index);
    } catch (error) {
        console.error('Admin get index error:', error);
        return errorResponse('Failed to get index details', 500, error.message);
    }
}

// PUT - Update index
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const body = await request.json();
        const validation = await validateRequest(updateIndexSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const index = await Index.findById(id);
        if (!index) {
            return notFoundResponse('Index not found');
        }

        // Apply updates
        Object.assign(index, validation.data);
        await index.save();

        // Log activity
        ActivityLog.log({
            userId: auth.user._id,
            action: 'admin_index_update',
            description: `Updated index: ${index.name}`,
            targetId: index._id,
            targetType: 'Index'
        });

        return successResponse(index, 'Index updated successfully');
    } catch (error) {
        console.error('Admin update index error:', error);
        return errorResponse('Failed to update index', 500, error.message);
    }
}

// DELETE - Delete index (Soft delete by deactivating)
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const index = await Index.findById(id);
        if (!index) {
            return notFoundResponse('Index not found');
        }

        index.isActive = false;
        await index.save();

        return successResponse(null, 'Index deactivated successfully');
    } catch (error) {
        console.error('Admin delete index error:', error);
        return errorResponse('Failed to deactivate index', 500, error.message);
    }
}
