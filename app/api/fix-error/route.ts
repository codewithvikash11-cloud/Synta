import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ErrorModel from '@/lib/models/Error';
import { normalizeError, generateErrorHash } from '@/lib/hashError';
import { validateErrorInput } from '@/lib/validateError';
import { generateErrorFix } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { errorLog } = await req.json();

        // 1. Validate Input
        const validation = validateErrorInput(errorLog);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.message }, { status: 400 });
        }

        await connectToDatabase();

        // 2. Normalization & Hashing
        const normalized = normalizeError(errorLog);
        const hash = generateErrorHash(normalized);

        // 3. Duplicate Check
        const existingError = await ErrorModel.findOne({ hash });

        if (existingError) {
            console.log(`Duplicate found: ${existingError.id}`);
            // If it's published, redirect to public SEO page (future).
            // For now, redirect to the fix page.
            return NextResponse.json({ redirectUrl: `/fix/${existingError.id}` });
        }

        // 4. AI Generation (Gemini)
        console.log('Generating AI solution...');
        const aiResult = await generateErrorFix(errorLog);

        // 5. Save to DB
        const newError = await ErrorModel.create({
            rawError: errorLog,
            normalizedError: normalized,
            hash: hash,
            language: 'Unknown', // Could infer from Gemini result or input
            aiSolution: aiResult,
            status: 'UNPUBLISHED',
        });

        console.log(`New Error created: ${newError.id}`);

        return NextResponse.json({ redirectUrl: `/fix/${newError.id}` });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
