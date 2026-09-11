import { db } from '@/lib/data/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ERDashboard() {
    let records: any[] = [];
    let errorMsg = null;

    try {
        const snapshot = await db.collection('dispatches').orderBy('timestamp', 'desc').limit(15).get();
        records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch {
        errorMsg = "Database connection offline. Showing mocked data.";
        records = [
            {
                id: 'MOCK-001',
                timestamp: new Date().toISOString(),
                triageData: { patientVitals: "HR 130", severityLevel: 5, requiredResources: ["Trauma Bay 1", "O- Blood"] },
                erpData: { bedId: "ICU-99", assignedAmbulance: "AMB-01" }
            }
        ];
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Activity className="text-red-500" /> ER INCOMING DASHBOARD
                        </h1>
                        <p className="text-neutral-400 mt-1 font-mono text-sm uppercase">Complex System View :: Live Firestore Sync</p>
                    </div>
                    <Link href="/">
                        <div className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-mono cursor-pointer border border-neutral-800 px-4 py-2 rounded-md">
                            <ArrowLeft className="w-4 h-4" /> BACK TO TERMINAL
                        </div>
                    </Link>
                </header>

                {errorMsg && (
                    <div className="bg-yellow-950/40 border border-yellow-900/50 text-yellow-500 p-3 rounded text-sm font-mono">
                        {errorMsg}
                    </div>
                )}

                <div className="border border-neutral-800 rounded-lg overflow-hidden bg-black/50">
                    <Table aria-label="Emergency Room Live Dispatch Board">
                        <TableHeader className="bg-neutral-900/80">
                            <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                                <TableHead className="text-neutral-400 font-mono text-xs">DISPATCH_ID</TableHead>
                                <TableHead className="text-neutral-400 font-mono text-xs">TIME</TableHead>
                                <TableHead className="text-neutral-400 font-mono text-xs">SEVERITY</TableHead>
                                <TableHead className="text-neutral-400 font-mono text-xs">VITALS</TableHead>
                                <TableHead className="text-neutral-400 font-mono text-xs">ASSIGNMENTS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow className="border-neutral-800">
                                    <TableCell colSpan={5} className="text-center text-neutral-500 py-8 font-mono">NO ACTIVE DISPATCHES</TableCell>
                                </TableRow>
                            ) : (
                                records.map((r) => (
                                    <TableRow key={r.id} className="border-neutral-800/50 hover:bg-neutral-900/50">
                                        <TableCell className="font-mono text-xs text-neutral-300">{r.id.substring(0,8)}</TableCell>
                                        <TableCell className="font-mono text-xs text-neutral-400">
                                            {new Date(r.timestamp).toLocaleTimeString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={r.triageData.severityLevel >= 4 ? 'destructive' : 'secondary'} className="font-mono">
                                                LVL {r.triageData.severityLevel}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-blue-200">{r.triageData.patientVitals}</TableCell>
                                        <TableCell className="font-mono text-xs text-green-400">
                                            {r.erpData.bedId} // {r.erpData.assignedAmbulance}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </main>
    );
}
