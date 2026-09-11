'use client';
import { useState, useRef } from 'react';
import { processParamedicNotes, DispatchResponse } from '@/lib/application/dispatch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, Server, Clock, Ambulance, UploadCloud, FileAudio, FileImage, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function DispatcherTerminal() {
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<DispatchResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');
        setResult(null);
        
        setTimeout(() => setStatus('verifying'), 1200);
        
        const formData = new FormData();
        formData.append('notes', notes);
        files.forEach(f => formData.append('media', f));

        const response = await processParamedicNotes(formData);
        
        if (response.success) {
            setStatus('success');
        } else {
            setStatus('error');
        }
        setResult(response);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans selection:bg-red-900/50">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="border-b border-neutral-800 pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Activity className="text-red-500 w-8 h-8" /> INVESTIGATOR TERMINAL
                        </h1>
                        <p className="text-neutral-400 mt-2 font-mono text-sm uppercase tracking-widest">MediBridge :: Sector 7 Orchestrator</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" className="border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 font-mono">
                            [VIEW ER DASHBOARD]
                        </Button>
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Panel */}
                    <Card className="bg-neutral-900/50 border-neutral-800 shadow-2xl shadow-red-900/5 backdrop-blur-sm">
                        <CardHeader className="border-b border-neutral-800/50 pb-4">
                            <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-neutral-400" /> MULTIMODAL INGEST
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Field Transmissions (Text)</label>
                                    <Textarea 
                                        placeholder="Awaiting unstructured field notes..." 
                                        className="min-h-[160px] bg-black/40 border-neutral-800 text-neutral-200 focus-visible:ring-red-500/50 font-mono text-sm resize-none"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        disabled={status === 'processing' || status === 'verifying'}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Encrypted Media (Audio/Images)</label>
                                    <div className="flex items-center gap-4">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="bg-black/40 border-neutral-800 hover:bg-neutral-800 text-neutral-300 w-full"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <FileImage className="w-4 h-4 mr-2" />
                                            <FileAudio className="w-4 h-4 mr-2" />
                                            {files.length > 0 ? `${files.length} Asset(s) Attached` : 'Attach Media'}
                                        </Button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            multiple 
                                            accept="image/*,audio/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-red-700 hover:bg-red-600 text-white font-bold tracking-widest transition-all uppercase h-14"
                                    disabled={status === 'processing' || status === 'verifying' || (!notes.trim() && files.length === 0)}
                                >
                                    {status === 'processing' ? '>> INGESTING MULTIMODAL STREAM...' : 
                                     status === 'verifying' ? '>> SECURING ERP PROTOCOLS...' : 
                                     '// INITIATE ORCHESTRATION'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <Card className="bg-neutral-900/50 border-neutral-800 shadow-2xl shadow-blue-900/5 backdrop-blur-sm">
                        <CardHeader className="border-b border-neutral-800/50 pb-4">
                            <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                                <Server className="w-5 h-5 text-neutral-400" /> SYSTEM OUTPUT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {status === 'idle' && (
                                <div className="h-[300px] flex items-center justify-center text-neutral-600 font-mono text-sm">
                                    [ TERMINAL STANDBY ]
                                </div>
                            )}

                            {(status === 'processing' || status === 'verifying') && (
                                <div className="space-y-6 animate-pulse">
                                    <div className="h-4 bg-red-900/20 rounded w-1/4"></div>
                                    <div className="h-32 bg-neutral-800/50 rounded w-full border border-neutral-800"></div>
                                    <div className="h-24 bg-neutral-800/50 rounded w-full border border-neutral-800"></div>
                                </div>
                            )}

                            {status === 'error' && result?.error && (
                                <div className="p-4 bg-red-950/50 border border-red-900 text-red-200 rounded-md flex gap-3 items-start">
                                    <AlertTriangle className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-100 font-mono">FATAL EXCEPTION</h4>
                                        <p className="text-sm mt-1 font-mono">{result.error}</p>
                                    </div>
                                </div>
                            )}

                            {status === 'success' && result?.triageData && (
                                <div className="space-y-6">
                                    {/* AI Verification Block */}
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex justify-between">
                                            <span>AI Synthesis Report</span>
                                            <span className="text-neutral-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> Verified</span>
                                        </h3>
                                        <div className="bg-black/60 p-5 rounded-md border border-neutral-800 space-y-4">
                                            <div className="flex justify-between items-start border-b border-neutral-800/50 pb-4">
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Vitals</p>
                                                    <p className="font-mono text-blue-100 text-lg">{result.triageData.patientVitals}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Confidence</p>
                                                    <p className="font-mono text-green-400 text-xl">{result.triageData.confidenceScore}%</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Symptoms</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {result.triageData.extractedSymptoms.map((sym, i) => (
                                                            <Badge key={i} variant="secondary" className="bg-neutral-800/80 text-neutral-300 font-mono text-xs">{sym}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Required Resources</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {result.triageData.requiredResources.map((res, i) => (
                                                            <Badge key={i} variant="outline" className="border-red-900/50 text-red-400 font-mono text-xs">{res}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Extracted Evidence (Traceability)</p>
                                                <ul className="list-disc pl-4 space-y-1">
                                                    {result.triageData.evidenceExtracted.map((ev, i) => (
                                                        <li key={i} className="text-xs font-mono text-neutral-400">{ev}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ERP Sync Block */}
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                                            <Server className="w-3 h-3" /> ERP System Target
                                        </h3>
                                        <div className="bg-green-950/20 border border-green-900/50 p-4 rounded-md text-green-100 flex flex-col gap-3 font-mono text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-1 bg-green-600 text-black font-bold text-xs">LOCKED</span>
                                                <span className="text-green-400/80">Resources securely committed to Hospital DB</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-green-300/80 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Ambulance className="w-4 h-4 text-green-500" /> {result.erpData?.assignedAmbulance}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-green-500" /> {result.erpData?.bedId}
                                                </div>
                                                <div className="col-span-2 text-xs text-green-500/50 mt-1">
                                                    TS: {new Date(result.erpData?.dispatchTime || Date.now()).toISOString()}
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
