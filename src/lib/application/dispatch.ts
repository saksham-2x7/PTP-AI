'use server';
import { analyzeFieldNotes, TriageData } from '../ai/triage';

export type DispatchResponse = {
    success: boolean;
    triageData?: TriageData;
    erpData?: {
        bedId: string;
        dispatchTime: string;
        assignedAmbulance: string;
        status: string;
    };
    error?: string;
}

export async function processParamedicNotes(notes: string): Promise<DispatchResponse> {
    if (!notes || notes.trim().length < 5) {
        return { success: false, error: "Input too short. Please provide details." };
    }

    try {
        const triageData = await analyzeFieldNotes(notes);
        
        if (triageData.extractedSymptoms.includes("Invalid Input")) {
             return { success: false, error: "Unrecognized medical input. Please provide valid paramedic notes." };
        }

        const erpData = {
            bedId: triageData.severityLevel >= 4 ? `ICU-${Math.floor(Math.random() * 100)}` : `ER-${Math.floor(Math.random() * 100)}`,
            dispatchTime: new Date().toISOString(),
            assignedAmbulance: `AMB-${Math.floor(Math.random() * 900) + 100}`,
            status: "RESOURCES_LOCKED"
        };

        return { success: true, triageData, erpData };
    } catch (error: any) {
        console.error("AI Dispatch Error:", error);
        
        // Mock fallback for missing API Key to prevent UX breaking during demonstration without keys
        if (error.message.includes("API key") || error.message.includes("fetch failed") || error.message.includes("mock-key")) {
            return {
               success: true,
               triageData: {
                  patientVitals: "HR 120, BP 90/60 (Mocked)",
                  severityLevel: 4,
                  extractedSymptoms: ["Severe blood loss", "API Key Missing fallback"],
                  requiredResources: ["O- Blood", "Trauma Bay"]
               },
               erpData: {
                  bedId: "ICU-42", dispatchTime: new Date().toISOString(), assignedAmbulance: "AMB-911", status: "RESOURCES_LOCKED"
               }
            }
        }
        
        return { success: false, error: error.message || "Failed to process notes." };
    }
}
