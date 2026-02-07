import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'UNPUBLISHED';

        const errors = await ErrorModel.find({ status })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return NextResponse.json(errors);
    } catch (error) {
        console.error('Errors List API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 });
    }
}
