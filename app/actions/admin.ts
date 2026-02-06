'use server';

import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export async function getDashboardStats() {
    await connectToDatabase();

    const totalErrors = await ErrorModel.countDocuments();
    const publishedErrors = await ErrorModel.countDocuments({ status: 'PUBLISHED' });
    const pendingErrors = await ErrorModel.countDocuments({ status: 'UNPUBLISHED' });
    const todayErrors = await ErrorModel.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    return {
        totalErrors,
        publishedErrors,
        pendingErrors,
        todayErrors,
    };
}

export async function getRecentErrors(limit = 10) {
    await connectToDatabase();
    // Serialize to plain objects to pass to Client Components
    const errors = await ErrorModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return JSON.parse(JSON.stringify(errors));
}
