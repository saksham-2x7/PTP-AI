'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export type ChatMessage = {
    role: 'user' | 'model';
    content: string;
};

export async function chatWithGemini(history: ChatMessage[], newMessage: string): Promise<{ success: boolean; reply?: string; error?: string }> {
    try {
        const systemPrompt = "You are the MediBridge Tactical Intelligence Assistant. You provide strict, accurate, and concise emergency medical protocols, hazmat procedures, and trauma guidelines to dispatchers. Speak in a clinical, authoritative, and fast-paced tone.";
        
        // Construct prompt context from history
        const context = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
        const finalPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${context}\n\nUSER: ${newMessage}\nMODEL:`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: finalPrompt
        });

        if (!response.text) {
            throw new Error("No response generated.");
        }

        return { success: true, reply: response.text };
    } catch (error: unknown) {
        console.error("Intelligence Chat Error:", error);
        return { success: false, error: "Failed to connect to Intelligence Core." };
    }
}
