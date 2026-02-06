'use server';

import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export async function getErrorResult(id: string) {
    try {
        await connectToDatabase();
        const error = await ErrorModel.findById(id).lean();

        if (!error) return null;

        return JSON.parse(JSON.stringify(error));
    } catch (e) {
        console.error("Failed to fetch error result:", e);
        return null;
    }
}
