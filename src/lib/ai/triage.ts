import { GoogleGenAI, Type, Schema } from '@google/genai';
import { z } from 'zod';

export const TriageSchema = z.object({
  patientVitals: z.string().describe("Extracted vital signs or 'Unknown'"),
  severityLevel: z.number().min(1).max(5).describe("1 (Minor) to 5 (Critical/Resuscitation)"),
  extractedSymptoms: z.array(z.string()).describe("List of core symptoms"),
  requiredResources: z.array(z.string()).describe("Required hospital resources like 'ER Bed', 'O- Blood', 'Ventilator'"),
});

export type TriageData = z.infer<typeof TriageSchema>;

export async function analyzeFieldNotes(notes: string): Promise<TriageData> {
    const apiKey = process.env.GEMINI_API_KEY || "mock-key-for-build";
    const ai = new GoogleGenAI({ apiKey });
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            patientVitals: { type: Type.STRING },
            severityLevel: { type: Type.INTEGER },
            extractedSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredResources: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["patientVitals", "severityLevel", "extractedSymptoms", "requiredResources"]
    } as Schema;

    const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert ER triage AI. Analyze these messy paramedic notes and extract the exact details requested. If the text is garbage or not medical, output severityLevel 1, Unknown vitals, empty resources, and 'Invalid Input' as a symptom.\n\nNotes: ${notes}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    if (!response.text) throw new Error("No response from Gemini");
    const data = JSON.parse(response.text);
    return TriageSchema.parse(data);
}
