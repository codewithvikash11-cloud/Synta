'use server';

import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export async function getErrorBySlug(slug: string) {
    await connectToDatabase();

    // Also try finding by ID if slug not found (fallback)
    let error = await ErrorModel.findOne({ formattedSlug: slug, status: 'PUBLISHED' }).lean();

    if (!error && slug.match(/^[0-9a-fA-F]{24}$/)) {
        error = await ErrorModel.findOne({ _id: slug, status: 'PUBLISHED' }).lean();
    }

    if (!error) return null;
    return JSON.parse(JSON.stringify(error));
}
