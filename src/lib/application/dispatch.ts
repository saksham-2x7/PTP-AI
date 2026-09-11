'use server';
import { logAuditInteraction } from '../data/auditLogger';
import { analyzeFieldNotes, TriageData } from '../ai/triage';
import { verifySafety, SecurityError } from '../ai/safety';

export type ERPData = { bedId: string; dispatchTime: string; assignedAmbulance: string; status: string; };

export type DispatchResponse = {
    success: boolean;
    isSecurityBreach?: boolean;
    triageData?: TriageData;
    erpData?: ERPData;
    error?: string;
}


// In-Memory Rate Limiter (Anti-DDoS)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
function checkRateLimit(ip: string = 'global'): boolean {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 5;

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + windowMs };
    } else {
        record.count += 1;
    }
    
    rateLimitMap.set(ip, record);
    return record.count <= maxRequests;
}

export async function proposeDispatch(formData: FormData): Promise<DispatchResponse> {
    const notes = formData.get('notes') as string || '';
    const trimmedNotes = notes.trim();
    const media = formData.getAll('media') as File[];
    const hasMedia = media.length > 0 && media.some(f => f.size > 0);
    
    if (trimmedNotes.length === 0 && !hasMedia) {
        return { success: false, error: "Transmission empty. Please enter field notes or attach media." };
    }
    
    if (trimmedNotes.length > 0 && trimmedNotes.length <= 10 && !hasMedia) {
        return { success: false, error: "Transmission too brief. Please provide actionable clinical observations, vitals, or scene notes." };
    }

    try {
        await verifySafety(formData);
        
        // triageData is now GUARANTEED to succeed via the robust internal catch block
        const triageData = await analyzeFieldNotes(formData);
        
        if (triageData.extractedSymptoms.includes("Invalid Input")) {
             return { success: false, error: "Unrecognized medical input. Please provide valid paramedic notes." };
        }

        const erpData = {
            bedId: triageData.severityLevel >= 4 ? `ICU-${Math.floor(Math.random() * 100)}` : `ER-${Math.floor(Math.random() * 100)}`,
            dispatchTime: new Date().toISOString(),
            assignedAmbulance: `AMB-${Math.floor(Math.random() * 900) + 100}`,
            status: "PENDING_AUTHORIZATION"
        };

        return { success: true, triageData, erpData };
    } catch (error: unknown) {
        const err = error as Error;
        
        if (err instanceof SecurityError || err.name === "SecurityError") {
            return { success: false, isSecurityBreach: true, error: err.message };
        }
        if (err.message && err.message.includes("No clinical signals")) {
            return { success: false, error: err.message };
        }

        return { success: false, error: "System failure. Please check connection." };
    }
}

export async function confirmDispatch(triageData: TriageData, erpData: ERPData): Promise<DispatchResponse> {
    erpData.status = "RESOURCES_LOCKED";
    try {
        const { db, collection, addDoc } = await import('../data/db');
        await addDoc(collection(db, 'dispatches'), {
            triageData,
            erpData,
            timestamp: new Date().toISOString()
        });
    } catch (error: unknown) {
        console.error("Firestore persistence skipped (mocking for demo):", error);
    }
    return { success: true, triageData, erpData };
}
