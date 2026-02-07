import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await connectToDatabase();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            totalErrors,
            pendingErrors,
            publishedErrors,
            todayErrors,
            recentActivity
        ] = await Promise.all([
            ErrorModel.countDocuments(),
            ErrorModel.countDocuments({ status: 'UNPUBLISHED' }),
            ErrorModel.countDocuments({ status: 'PUBLISHED' }),
            ErrorModel.countDocuments({ createdAt: { $gte: todayStart } }),
            ErrorModel.find().sort({ createdAt: -1 }).limit(10).lean()
        ]);

        return NextResponse.json({
            totalErrors,
            pendingErrors,
            publishedErrors,
            todayErrors,
            recentActivity
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
