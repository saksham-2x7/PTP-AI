import { GoogleGenAI, Type, Schema } from '@google/genai';
import { z } from 'zod';

export const TriageSchema = z.object({
  patientVitals: z.string().describe("Extracted vital signs or 'Unknown'"),
  severityLevel: z.number().min(1).max(5).describe("1 (Minor) to 5 (Critical/Resuscitation)"),
  extractedSymptoms: z.array(z.string()).describe("List of core symptoms"),
  requiredResources: z.array(z.string()).describe("Required hospital resources like 'ER Bed', 'O- Blood', 'Ventilator'"),
  confidenceScore: z.number().min(1).max(100).describe("Confidence score of this assessment"),
  evidenceExtracted: z.array(z.string()).describe("List of concrete evidence verifying the decision")
});

export type TriageData = z.infer<typeof TriageSchema>;

export async function analyzeFieldNotes(formData: FormData): Promise<TriageData> {
    const apiKey = process.env.GEMINI_API_KEY || "mock-key-for-build";
    const ai = new GoogleGenAI({ apiKey });
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            patientVitals: { type: Type.STRING },
            severityLevel: { type: Type.INTEGER },
            extractedSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredResources: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.INTEGER },
            evidenceExtracted: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["patientVitals", "severityLevel", "extractedSymptoms", "requiredResources", "confidenceScore", "evidenceExtracted"]
    } as Schema;

    const textNotes = formData.get('notes') as string || '';
    const mediaFiles = formData.getAll('media') as File[];

    let contents: any[] = [{ text: `You are an expert ER triage AI. Analyze the multimodal paramedic inputs (notes and optional images/audio). Extract exact details. If invalid input, output severity 1 and 'Invalid Input' as a symptom.\n\nNotes: ${textNotes}` }];

    for (const file of mediaFiles) {
        if (file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            contents.push({
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type || "application/octet-stream"
                }
            });
        }
    }

    const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    if (!response.text) throw new Error("No response from Gemini");
    const data = JSON.parse(response.text);
    return TriageSchema.parse(data);
}
