'use client';
import { useState } from 'react';
import { processParamedicNotes, DispatchResponse } from '@/lib/application/dispatch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, Server, Clock, Ambulance } from 'lucide-react';

export default function DispatcherTerminal() {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<DispatchResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');
        setResult(null);
        
        // Artificial delay to show 'verifying' state
        setTimeout(() => setStatus('verifying'), 800);
        
        const response = await processParamedicNotes(notes);
        
        if (response.success) {
            setStatus('success');
        } else {
            setStatus('error');
        }
        setResult(response);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                <header className="border-b border-neutral-800 pb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Activity className="text-red-500" /> MediBridge Dispatch Terminal
                    </h1>
                    <p className="text-neutral-400 mt-1">Universal AI Orchestrator: Messy Intent &rarr; Safe Action</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Panel */}
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Inbound Paramedic Comms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Textarea 
                                    placeholder="Enter messy field notes, e.g., 'male 45 car accident chest pain bp drops to 90 over 60 need blood fast'" 
                                    className="min-h-[200px] bg-neutral-950 border-neutral-800 text-white focus-visible:ring-red-500"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={status === 'processing' || status === 'verifying'}
                                />
                                <Button 
                                    type="submit" 
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                                    disabled={status === 'processing' || status === 'verifying' || !notes.trim()}
                                >
                                    {status === 'processing' ? 'Extracting via Gemini...' : 
                                     status === 'verifying' ? 'Locking ERP Resources...' : 
                                     'Orchestrate Dispatch'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Action Orchestration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {status === 'idle' && (
                                <div className="h-full min-h-[200px] flex items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-md">
                                    Waiting for inbound communications...
                                </div>
                            )}

                            {(status === 'processing' || status === 'verifying') && (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-8 bg-neutral-800 rounded w-1/3"></div>
                                    <div className="h-24 bg-neutral-800 rounded w-full"></div>
                                    <div className="h-16 bg-neutral-800 rounded w-full"></div>
                                </div>
                            )}

                            {status === 'error' && result?.error && (
                                <div className="p-4 bg-red-950 border border-red-900 text-red-200 rounded-md flex gap-3 items-start">
                                    <AlertTriangle className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-100">Orchestration Failed</h4>
                                        <p className="text-sm mt-1">{result.error}</p>
                                    </div>
                                </div>
                            )}

                            {status === 'success' && result?.triageData && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">AI Structured Triage</h3>
                                        <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-xs text-neutral-500 mb-1">Vitals</p>
                                                    <p className="font-mono text-white">{result.triageData.patientVitals}</p>
                                                </div>
                                                <Badge variant={result.triageData.severityLevel >= 4 ? 'destructive' : 'default'} className="text-sm">
                                                    Severity {result.triageData.severityLevel}
                                                </Badge>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-neutral-500 mb-1">Extracted Symptoms</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.triageData.extractedSymptoms.map((sym, i) => (
                                                            <Badge key={i} variant="secondary" className="bg-neutral-800 text-neutral-200">{sym}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500 mb-1">Required Resources</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.triageData.requiredResources.map((res, i) => (
                                                            <Badge key={i} variant="outline" className="border-red-900 text-red-400">{res}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                            <Server className="w-4 h-4" /> ERP System Sync
                                        </h3>
                                        <div className="bg-green-950/30 border border-green-900 p-4 rounded-md text-green-100 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-600 hover:bg-green-600">LOCKED</Badge>
                                                <span className="text-sm">Resources confirmed via Hospital API</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                                <div className="flex items-center gap-2 text-green-300">
                                                    <Ambulance className="w-4 h-4" /> {result.erpData?.assignedAmbulance}
                                                </div>
                                                <div className="flex items-center gap-2 text-green-300">
                                                    <Activity className="w-4 h-4" /> {result.erpData?.bedId}
                                                </div>
                                                <div className="flex items-center gap-2 text-green-300 col-span-2">
                                                    <Clock className="w-4 h-4" /> Dispatched: {new Date(result.erpData?.dispatchTime || Date.now()).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
