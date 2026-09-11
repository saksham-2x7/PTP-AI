export const dynamic = 'force-dynamic';
import { db, collection, getDocs, query, orderBy, limit } from '@/lib/data/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MemoizedTableRow } from '@/components/ui/MemoizedTableRow';
import { Server, Activity, Clock, ShieldCheck } from 'lucide-react';

export default async function DashboardPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let records: any[] = [];
    try {
        const q = query(collection(db, 'dispatches'), orderBy('timestamp', 'desc'), limit(15));
        const snapshot = await getDocs(q);
        records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch {
        // Fallback for demo
        records = [
            {
                id: 'demo-1',
                timestamp: new Date().toISOString(),
                triageData: { patientVitals: 'HR 135, BP 80/50', severityLevel: 1, extractedSymptoms: ['Crush Injury', 'Tension Pneumothorax'] },
                erpData: { assignedAmbulance: 'AMB-7', bedId: 'TRAUMA-1', status: 'RESOURCES_LOCKED' }
            }
        ];
    }

    return (
        <main role="main" aria-label="ER Operations Dashboard" className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10">
            <header className="mb-8 shrink-0">
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Server className="text-blue-500 w-8 h-8" /> ER OPERATIONS CENTER
                </h2>
                <p className="text-neutral-400 mt-2 font-mono text-xs uppercase tracking-widest">
                    Live dispatch synchronization stream
                </p>
            </header>

            <Card className="bg-neutral-950/40 backdrop-blur-xl border-white/10 shadow-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4 shrink-0 bg-white/5">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" /> ACTIVE DISPATCHES
                        </CardTitle>
                        <Badge variant="outline" className="border-green-900/50 text-green-400 font-mono shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            <ShieldCheck className="w-3 h-3 mr-1" /> SECURE LINK
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-black/40 font-mono sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Patient Profile</th>
                                <th className="px-6 py-4">Resources Allocated</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {records.map((record) => (
                                <MemoizedTableRow key={record.id} record={record} />
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-mono">
                                        No active dispatches in Sector 7.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </main>
    );
}
