'use server';

import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export async function searchErrors(query: string) {
    if (!query) return [];

    await connectToDatabase();

    // Basic regex search for now. In production, use MongoDB Atlas Search.
    const errors = await ErrorModel.find({
        status: 'PUBLISHED',
        $or: [
            { 'aiSolution.title': { $regex: query, $options: 'i' } },
            { rawError: { $regex: query, $options: 'i' } }
        ]
    })
        .select('aiSolution.title formattedSlug rawError createdAt')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    return JSON.parse(JSON.stringify(errors));
}
