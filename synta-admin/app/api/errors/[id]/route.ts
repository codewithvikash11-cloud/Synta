import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';
import { calculateSimilarity } from '@/lib/similarity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const error = await ErrorModel.findById(id).lean();
        if (!error) {
            return NextResponse.json({ error: 'Error not found' }, { status: 404 });
        }

        // Duplicate Check Logic (Moved from page)
        let duplicate = null;
        try {
            const recentErrors = await ErrorModel.find({
                _id: { $ne: error._id }
            })
                .sort({ createdAt: -1 })
                .limit(100)
                .select('rawError _id status')
                .lean();

            let bestMatch = { id: '', score: 0, status: '' };

            for (const err of recentErrors) {
                const score = calculateSimilarity(error.rawError, (err as any).rawError);
                if (score > bestMatch.score) {
                    bestMatch = {
                        id: (err as any)._id.toString(),
                        score,
                        status: (err as any).status
                    };
                }
            }

            if (bestMatch.score > 80) {
                duplicate = bestMatch;
            }
        } catch (e) {
            console.error('Duplicate check failed', e);
        }

        return NextResponse.json({ error, duplicate });

    } catch (error) {
        console.error('Error Detail API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch error' }, { status: 500 });
    }
}
