import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('Please define the GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // or 'gemini-1.5-flash' depending on access

interface FixResult {
    explanation: string;
    rootCause: string;
    steps: string[];
    fixedCode: string;
    prevention: string;
    title: string; // Generated title for SEO
}

export async function generateErrorFix(errorLog: string): Promise<FixResult> {
    const prompt = `
    You are a senior debugger. Analyze the following programming error and provide a structured solution.
    
    ERROR:
    ${errorLog}
    
    OUTPUT JSON FORMAT ONLY:
    {
      "title": "Short SEO-friendly title (e.g., Fix NullPointer in Java)",
      "explanation": "2-3 sentences explaining the error in plain English.",
      "rootCause": "Technical explanation of why it happened.",
      "steps": ["Step 1...", "Step 2..."],
      "fixedCode": "The corrected code snippet only.",
      "prevention": "1-2 tips to avoid this in future."
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup markdown code blocks if Gemini returns them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr) as FixResult;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate solution');
    }
}
