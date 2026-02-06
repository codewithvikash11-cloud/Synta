'use server';

import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';
import { revalidatePath } from 'next/cache';

export async function updateErrorStatus(id: string, status: string, aiSolution?: any) {
    try {
        await connectToDatabase();

        // Create a slug if publishing
        let slug = undefined;
        if (status === 'PUBLISHED' && aiSolution?.title) {
            slug = aiSolution.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        await ErrorModel.findByIdAndUpdate(id, {
            status,
            aiSolution,
            ...(slug && { formattedSlug: slug })
        });

        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/errors');
        revalidatePath(`/admin/errors/${id}`);

        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to update' };
    }
}

export async function getErrorById(id: string) {
    await connectToDatabase();
    const error = await ErrorModel.findById(id).lean();
    if (!error) return null;
    return JSON.parse(JSON.stringify(error));
}
