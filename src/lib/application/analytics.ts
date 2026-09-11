'use server';

import { db, collection, getDocs, query, orderBy, limit } from '@/lib/data/db';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function generateShiftSummary(): Promise<{ success: boolean; summary?: string; error?: string }> {
    try {
        const q = query(collection(db, 'dispatches'), orderBy('timestamp', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map(doc => doc.data());

        if (records.length === 0) {
            return { success: true, summary: "No dispatch records found for the current shift." };
        }

        const dataDump = JSON.stringify(records);
        const prompt = `You are an elite emergency medical analytics AI. Analyze the following recent dispatch records and provide a concise, 2-paragraph "Shift Summary Report" evaluating the ER's trauma load, common injury patterns, and resource bottlenecks. Do not use pleasantries. Output direct tactical analysis.\n\nDATA:\n${dataDump}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt
        });

        return { success: true, summary: response.text || "Report generation failed." };
    } catch (error: unknown) {
        console.error("Analytics Error:", error);
        // Return the EXACT error to the UI so we can diagnose the Vercel issue
        return { success: false, error: `Diagnostics: ${(error as Error).message || 'Unknown Server Error'}` };
    }
}
