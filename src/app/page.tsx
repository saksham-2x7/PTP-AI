'use client';
import { useState, useRef, useEffect } from 'react';
import { proposeDispatch, confirmDispatch, DispatchResponse } from '@/lib/application/dispatch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, Server, Clock, Ambulance, UploadCloud, FileAudio, FileImage, ShieldCheck, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DispatcherTerminal() {
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [demoFiles, setDemoFiles] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing_proposal' | 'proposed' | 'authorizing' | 'success' | 'security_breach' | 'error'>('idle');
    const [result, setResult] = useState<DispatchResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const anim = {
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: shouldReduceMotion ? 0 : -10 },
        transition: { duration: 0.3, ease: 'easeOut' as const }
    };

    // Hotkey for Demo: Ctrl/Cmd + Shift + D
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
                loadDemoScenario();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const loadDemoScenario = () => {
        setNotes("Dispatch this is unit 4, mass casualty incident on I-95. 3 vehicles involved. Priority 1 is a 45yo male, severe crush injury to chest, BP dropping fast 80 over 50, HR 135. Suspect tension pneumothorax. Priority 2 is female, 30s, head lac but conscious. Need trauma bay ready for P1, possible blood trans O-negative. Sending scene photo and dash audio.");
        setDemoFiles(true);
        setStatus('idle');
        setResult(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setDemoFiles(false);
        }
    };

    const handlePropose = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing_proposal');
        setResult(null);
        
        const formData = new FormData();
        formData.append('notes', notes);
        files.forEach(f => formData.append('media', f));
        
        if (demoFiles && files.length === 0) {
             const mockFile = new File(["mock"], "scene_photo.jpg", { type: "image/jpeg" });
             formData.append('media', mockFile);
        }

        const response = await proposeDispatch(formData);
        
        if (response.isSecurityBreach) {
            setStatus('security_breach');
        } else if (response.success) {
            setStatus('proposed');
        } else {
            setStatus('error');
        }
        setResult(response);
    };

    const handleAuthorize = async () => {
        if (!result?.triageData || !result?.erpData) return;
        setStatus('authorizing');
        
        setTimeout(async () => {
            const finalResponse = await confirmDispatch(result.triageData!, result.erpData!);
            if (finalResponse.success) {
                setStatus('success');
                setResult(finalResponse);
            } else {
                setStatus('error');
            }
        }, 600);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans selection:bg-red-900/50 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="border-b border-neutral-800 pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3" aria-label="Investigator Terminal Title">
                            <Activity className="text-red-500 w-8 h-8" aria-hidden="true" /> INVESTIGATOR TERMINAL
                        </h1>
                        <p className="text-neutral-400 mt-2 font-mono text-sm uppercase tracking-widest">MediBridge :: Sector 7 Orchestrator</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Button variant="ghost" className="text-neutral-500 hover:text-white font-mono text-xs" onClick={loadDemoScenario}>
                            <Zap className="w-3 h-3 mr-2 text-yellow-500"/> [ LOAD DEMO ]
                        </Button>
                        <Link href="/dashboard" aria-label="View Emergency Room Dashboard">
                            <Button variant="outline" className="border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 font-mono">
                                [VIEW ER DASHBOARD]
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Panel */}
                    <Card className="bg-neutral-900/50 border-neutral-800 shadow-2xl shadow-red-900/5 backdrop-blur-sm relative overflow-hidden">
                        <CardHeader className="border-b border-neutral-800/50 pb-4">
                            <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-neutral-400" aria-hidden="true" /> MULTIMODAL INGEST
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handlePropose} className="space-y-6" aria-label="Multimodal Triage Form">
                                <div className="space-y-3">
                                    <label htmlFor="notes-input" className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Field Transmissions (Text)</label>
                                    <Textarea 
                                        id="notes-input"
                                        aria-label="Enter messy field notes"
                                        placeholder="Awaiting unstructured field notes... (Press Cmd+Shift+D for Demo)" 
                                        className="min-h-[160px] bg-black/40 border-neutral-800 text-neutral-200 focus-visible:ring-red-500/50 font-mono text-sm resize-none leading-relaxed"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        disabled={status !== 'idle' && status !== 'error' && status !== 'security_breach'}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Encrypted Media (Audio/Images)</label>
                                    <div className="flex items-center gap-4">
                                        <Button 
                                            type="button" 
                                            aria-label="Attach Audio or Image Files"
                                            variant="outline" 
                                            className={`bg-black/40 border-neutral-800 hover:bg-neutral-800 text-neutral-300 w-full transition-colors ${demoFiles ? 'border-yellow-900/50 text-yellow-500 bg-yellow-950/10' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={status !== 'idle' && status !== 'error' && status !== 'security_breach'}
                                        >
                                            <FileImage className="w-4 h-4 mr-2" aria-hidden="true" />
                                            <FileAudio className="w-4 h-4 mr-2" aria-hidden="true" />
                                            {demoFiles ? '2 Mock Assets Attached (Demo)' : files.length > 0 ? `${files.length} Asset(s) Attached` : 'Attach Media'}
                                        </Button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            multiple 
                                            accept="image/*,audio/*"
                                            onChange={handleFileChange}
                                            aria-label="Hidden File Input"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    aria-label="Initiate AI Orchestration Proposal"
                                    className="w-full bg-red-700 hover:bg-red-600 text-white font-bold tracking-widest transition-all uppercase h-14"
                                    disabled={status === 'processing_proposal' || status === 'proposed' || status === 'authorizing' || status === 'success' || (!notes.trim() && files.length === 0 && !demoFiles)}
                                >
                                    {status === 'processing_proposal' ? '>> INGESTING STREAM & RUNNING SAFETY SHIELD...' : 
                                     '// INITIATE ORCHESTRATION'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <Card className="bg-neutral-900/50 border-neutral-800 shadow-2xl shadow-blue-900/5 backdrop-blur-sm" aria-live="polite">
                        <CardHeader className="border-b border-neutral-800/50 pb-4">
                            <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                                <Server className="w-5 h-5 text-neutral-400" aria-hidden="true" /> SYSTEM OUTPUT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 relative min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {status === 'idle' && (
                                    <motion.div key="idle" {...anim} className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-sm">
                                        [ TERMINAL STANDBY ]
                                    </motion.div>
                                )}

                                {status === 'processing_proposal' && (
                                    <motion.div key="processing" {...anim} className="absolute inset-6 space-y-6" aria-label="Processing Request">
                                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-4 bg-red-900/20 rounded w-1/4"></motion.div>
                                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="h-32 bg-neutral-800/50 rounded w-full border border-neutral-800"></motion.div>
                                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="h-24 bg-neutral-800/50 rounded w-full border border-neutral-800"></motion.div>
                                    </motion.div>
                                )}

                                {status === 'security_breach' && (
                                    <motion.div key="breach" {...anim} className="absolute inset-6 p-6 bg-red-950 border-2 border-red-600 text-red-200 rounded-lg flex flex-col gap-4 items-center text-center shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                                        <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" aria-hidden="true" />
                                        <div>
                                            <h4 className="font-black text-red-500 font-mono text-2xl tracking-widest">SECURITY BREACH</h4>
                                            <p className="text-sm mt-2 font-mono max-w-md">{result?.error || "Malicious input detected. Operation halted."}</p>
                                        </div>
                                        <Button variant="outline" className="mt-4 border-red-800 text-red-400 hover:bg-red-900/50" onClick={() => setStatus('idle')}>RESET TERMINAL</Button>
                                    </motion.div>
                                )}

                                {status === 'error' && result?.error && !result.isSecurityBreach && (
                                    <motion.div key="error" {...anim} className="absolute inset-6 p-4 bg-yellow-950/50 border border-yellow-900 text-yellow-200 rounded-md flex gap-3 items-start h-fit">
                                        <AlertTriangle className="shrink-0 mt-0.5" aria-hidden="true" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-500 font-mono">SYSTEM ERROR</h4>
                                            <p className="text-sm mt-1 font-mono">{result.error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {(status === 'proposed' || status === 'authorizing' || status === 'success') && result?.triageData && (
                                    <motion.div key="success" {...anim} className="absolute inset-6 space-y-6 w-full">
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex justify-between">
                                                <span>AI Synthesis Proposal</span>
                                                <span className="text-neutral-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> Verified Safe</span>
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
                                            </div>
                                        </div>

                                        {/* ERP Proposal / HITL Action */}
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                                                <Server className="w-3 h-3" /> ACTION PROPOSAL (REQUIRES AUTHORIZATION)
                                            </h3>
                                            <motion.div 
                                                layout
                                                className={`p-4 rounded-md flex flex-col gap-3 font-mono text-sm border transition-colors ${status === 'success' ? 'bg-green-950/20 border-green-900/50 text-green-100' : 'bg-yellow-950/20 border-yellow-900/50 text-yellow-100'}`}
                                            >
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Ambulance className={`w-4 h-4 ${status === 'success' ? 'text-green-500' : 'text-yellow-500'}`} /> {result.erpData?.assignedAmbulance}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Activity className={`w-4 h-4 ${status === 'success' ? 'text-green-500' : 'text-yellow-500'}`} /> {result.erpData?.bedId}
                                                    </div>
                                                </div>
                                                
                                                <AnimatePresence mode="wait">
                                                    {status === 'proposed' && (
                                                        <motion.div key="btn-propose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                            <Button 
                                                                aria-label="Authorize Dispatch and Lock Resources"
                                                                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black tracking-widest shadow-[0_0_20px_rgba(202,138,4,0.4)] transition-all animate-pulse"
                                                                onClick={handleAuthorize}
                                                            >
                                                                [ AUTHORIZE DISPATCH ]
                                                            </Button>
                                                        </motion.div>
                                                    )}

                                                    {status === 'authorizing' && (
                                                        <motion.div key="btn-auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                            <Button disabled className="w-full mt-4 bg-neutral-800 text-neutral-400 tracking-widest">
                                                                SECURING CONNECTION...
                                                            </Button>
                                                        </motion.div>
                                                    )}

                                                    {status === 'success' && (
                                                        <motion.div key="btn-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 mt-4 p-2 bg-green-900/30 rounded text-green-400 font-bold tracking-widest">
                                                            <CheckCircle2 className="w-5 h-5" /> RESOURCES LOCKED
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
