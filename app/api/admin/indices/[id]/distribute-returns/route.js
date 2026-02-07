import connectDB from '@/lib/db';
import Index from '@/models/Index';
import Investment from '@/models/Investment';
import { requireAdmin } from '@/lib/middleware/auth';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/response';
import { validateRequest, distributeReturnsSchema } from '@/lib/validation';
import ActivityLog from '@/models/ActivityLog';

// POST - Distribute returns for an index
export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const auth = await requireAdmin(request);
        if (!auth.success) {
            return auth.response;
        }

        const body = await request.json();
        const validation = await validateRequest(distributeReturnsSchema, body);
        if (!validation.success) {
            return validationErrorResponse(validation.errors);
        }

        const index = await Index.findById(id);
        if (!index) {
            return notFoundResponse('Index not found');
        }

        const { returnRate, weekStart, weekEnd } = validation.data;

        // Find all active investments for this index
        const investments = await Investment.find({
            indexId: id,
            status: 'active',
            isActive: true
        });

        if (investments.length === 0) {
            return successResponse({ count: 0 }, 'No active investments found for this index');
        }

        // Distribution logic (Simplified for restoration)
        let distributedCount = 0;
        let totalDistributedAmount = 0;

        for (const investment of investments) {
            const returnAmount = (investment.amount * returnRate) / 100;

            // Add return to investment record
            investment.totalReturns += returnAmount;
            investment.lastReturnAt = new Date();
            investment.returnHistory.push({
                amount: returnAmount,
                rate: returnRate,
                weekStart,
                weekEnd,
                distributedAt: new Date()
            });

            await investment.save();
            distributedCount++;
            totalDistributedAmount += returnAmount;
        }

        // Update index stats
        index.totalReturnsDistributed += totalDistributedAmount;
        index.currentReturnRate = returnRate;
        await index.save();

        // Log activity
        ActivityLog.log({
            userId: auth.user._id,
            action: 'admin_distribute_returns',
            description: `Distributed ${returnRate}% returns for index ${index.name} to ${distributedCount} investors`,
            targetId: index._id,
            targetType: 'Index'
        });

        return successResponse({
            distributedCount,
            totalDistributedAmount,
            index: index.name
        }, 'Returns distributed successfully');

    } catch (error) {
        console.error('Admin distribute returns error:', error);
        return errorResponse('Failed to distribute returns', 500, error.message);
    }
}
