'use client';
import { useState, useRef, useEffect } from 'react';
import { proposeDispatch, confirmDispatch, DispatchResponse } from '@/lib/application/dispatch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Ambulance, UploadCloud, FileAudio, FileImage, ShieldCheck, ShieldAlert, CheckCircle2, Zap, Mic } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CyberScanner } from '@/components/ui/CyberScanner';
import { MCPMatrix } from '@/components/ui/MCPMatrix';

export default function DispatcherTerminal() {
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [demoFiles, setDemoFiles] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing_proposal' | 'proposed' | 'authorizing' | 'success' | 'security_breach' | 'error'>('idle');
    const [result, setResult] = useState<DispatchResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const toggleDictation = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Microphone dictation is only supported in Chrome/Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) {
                setNotes(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTranscript.trim() + ' ');
            }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };
    const shouldReduceMotion = useReducedMotion();

    const anim = {
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: shouldReduceMotion ? 0 : -10 },
        transition: { duration: 0.3, ease: 'easeOut' as const }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
                loadDemoScenario();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    function loadDemoScenario() {
        setNotes("Dispatch this is unit 4, mass casualty incident on I-95. 3 vehicles involved. Priority 1 is a 45yo male, severe crush injury to chest, BP dropping fast 80 over 50, HR 135. Suspect tension pneumothorax. Priority 2 is female, 30s, head lac but conscious. Need trauma bay ready for P1, possible blood trans O-negative. Sending scene photo and dash audio.");
        setDemoFiles(true);
        setStatus('idle');
        setResult(null);
    }

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
        <main className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10">
            <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Activity className="text-red-500 w-8 h-8" /> ORCHESTRATION TERMINAL
                    </h2>
                    <p className="text-neutral-400 mt-2 font-mono text-xs uppercase tracking-widest">
                        Awaiting unstructured field input...
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="ghost" className="text-neutral-500 hover:text-white font-mono text-xs" onClick={loadDemoScenario}>
                        <Zap className="w-3 h-3 mr-2 text-yellow-500"/> [ LOAD DEMO ]
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                {/* Input Panel */}
                <Card className="bg-neutral-950/40 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col h-full">
                    <CardHeader className="border-b border-white/5 pb-4 shrink-0">
                        <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-neutral-400" /> MULTIMODAL INGEST
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1 flex flex-col min-h-0 overflow-y-auto">
                        <CyberScanner />
                        <form onSubmit={handlePropose} className="space-y-6 flex-1 flex flex-col mt-6">
                            <div className="space-y-3 flex-1 flex flex-col">
                                <div className="flex justify-between items-center">
        <label htmlFor="notes-input" className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Field Transmissions (Live)</label>
        <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={toggleDictation}
            className={`h-6 px-2 text-xs font-mono ${isListening ? 'bg-red-950/50 text-red-400 animate-pulse border border-red-900' : 'text-neutral-500 hover:text-white'}`}
        >
            <Mic className="w-3 h-3 mr-1" /> {isListening ? 'RECORDING...' : 'DICTATE'}
        </Button>
    </div>
                                <Textarea 
                                    id="notes-input"
                                    placeholder="Paste field notes here..." 
                                    className="flex-1 min-h-[160px] bg-black/60 border-white/5 text-neutral-200 focus-visible:ring-red-500/50 font-mono text-sm resize-none"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={status !== 'idle' && status !== 'error' && status !== 'security_breach'}
                                />
                            </div>
                            
                            <div className="space-y-3 shrink-0">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Encrypted Media</label>
                                <div className="flex items-center gap-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className={`bg-black/60 border-white/5 hover:bg-white/5 text-neutral-300 w-full transition-colors ${demoFiles ? 'border-yellow-900/50 text-yellow-500 bg-yellow-950/20' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={status !== 'idle' && status !== 'error' && status !== 'security_breach'}
                                    >
                                        <FileImage className="w-4 h-4 mr-2" />
                                        <FileAudio className="w-4 h-4 mr-2" />
                                        {demoFiles ? '2 Mock Assets Attached (Demo)' : files.length > 0 ? `${files.length} Asset(s) Attached` : 'Attach Media'}
                                    </Button>
                                    <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,audio/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full shrink-0 bg-red-700 hover:bg-red-600 text-white font-bold tracking-widest transition-all uppercase h-14 mt-auto shadow-[0_0_20px_rgba(185,28,28,0.2)]"
                                disabled={status === 'processing_proposal' || status === 'proposed' || status === 'authorizing' || status === 'success' || (!notes.trim() && files.length === 0 && !demoFiles)}
                            >
                                {status === 'processing_proposal' ? '>> INGESTING STREAM...' : '// INITIATE ORCHESTRATION'}
                            </Button>
                        </form>
                        <MCPMatrix isProcessing={status === 'processing_proposal'} />
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <Card className="bg-neutral-950/40 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col h-full min-h-[500px]">
                    <CardHeader className="border-b border-white/5 pb-4 shrink-0">
                        <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                            <Server className="w-5 h-5 text-neutral-400" /> SYSTEM OUTPUT
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {status === 'idle' && (
                                <motion.div key="idle" {...anim} className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-sm">
                                    [ TERMINAL STANDBY ]
                                </motion.div>
                            )}

                            {status === 'processing_proposal' && (
                                <motion.div key="processing" {...anim} className="absolute inset-0 p-6 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-full h-1 bg-neutral-900 rounded overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-red-500" 
                                            animate={{ x: ["-100%", "200%"] }} 
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        />
                                    </div>
                                    <p className="text-red-500 font-mono text-sm tracking-widest animate-pulse">DECRYPTING TRANSMISSION...</p>
                                </motion.div>
                            )}

                            {status === 'security_breach' && (
                                <motion.div key="breach" {...anim} className="absolute inset-0 m-6 p-6 bg-red-950/80 border-2 border-red-600 text-red-200 rounded-lg flex flex-col gap-4 items-center justify-center text-center shadow-[0_0_50px_rgba(220,38,38,0.4)] backdrop-blur-md">
                                    <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
                                    <div>
                                        <h4 className="font-black text-red-500 font-mono text-2xl tracking-widest">SECURITY BREACH</h4>
                                        <p className="text-sm mt-2 font-mono max-w-md">{result?.error || "Malicious input detected."}</p>
                                    </div>
                                    <Button variant="outline" className="mt-4 border-red-800 text-red-400 hover:bg-red-900/50" onClick={() => setStatus('idle')}>RESET TERMINAL</Button>
                                </motion.div>
                            )}

                            {(status === 'proposed' || status === 'authorizing' || status === 'success') && result?.triageData && (
                                <motion.div key="success" {...anim} className="absolute inset-0 flex flex-col p-6 overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex justify-between items-center gap-2">
                                            <span>AI Synthesis Proposal</span>
                                            <span className="text-neutral-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> Verified Safe</span>
                                        </h3>
                                        
                                        <div className="bg-black/60 p-5 rounded-md border border-white/5 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-white/5 pb-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Vitals</p>
                                                    <p className="font-mono text-blue-100 text-lg leading-tight">{result.triageData.patientVitals}</p>
                                                </div>
                                                <div className="sm:text-right shrink-0">
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Confidence</p>
                                                    <p className="font-mono text-green-400 text-xl font-black">{result.triageData.confidenceScore}%</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Symptoms</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.triageData.extractedSymptoms.map((sym, i) => (
                                                            <Badge key={i} variant="secondary" className="bg-white/5 text-neutral-300 font-mono text-xs">{sym}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500 uppercase font-bold mb-2">Required Resources</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.triageData.requiredResources.map((res, i) => (
                                                            <Badge key={i} variant="outline" className="border-red-900/50 text-red-400 font-mono text-xs shadow-[0_0_10px_rgba(185,28,28,0.2)]">{res}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pt-4 mt-2 border-t border-white/5 space-y-2">
                                        <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                                            <Server className="w-3 h-3" /> ACTION PROPOSAL
                                        </h3>
                                        <motion.div 
                                            layout
                                            className={`p-4 rounded-md flex flex-col gap-3 font-mono text-sm border transition-colors ${status === 'success' ? 'bg-green-950/20 border-green-900/50 text-green-100 shadow-[0_0_30px_rgba(22,163,74,0.2)]' : 'bg-yellow-950/20 border-yellow-900/50 text-yellow-100 shadow-[0_0_30px_rgba(202,138,4,0.1)]'}`}
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
                                                            className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black tracking-widest shadow-[0_0_20px_rgba(202,138,4,0.4)] transition-all animate-pulse"
                                                            onClick={handleAuthorize}
                                                        >
                                                            [ AUTHORIZE DISPATCH ]
                                                        </Button>
                                                    </motion.div>
                                                )}

                                                {status === 'success' && (
                                                    <motion.div key="btn-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 mt-4 p-2 bg-green-900/30 rounded text-green-400 font-bold tracking-widest">
                                                        <CheckCircle2 className="w-5 h-5 shrink-0" /> RESOURCES LOCKED
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
        </main>
    );
}
